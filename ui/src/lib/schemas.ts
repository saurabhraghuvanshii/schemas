import fs from "fs";
import path from "path";
import yaml from "js-yaml";

/**
 * Parse properties from an OpenAPI components/schemas style YAML file.
 */
export function loadSchemaProperties(version: string, constructName: string, schemaObjName: string) {
  const subPath = path.join(
    process.cwd(),
    "..",
    "schemas",
    "constructs",
    version,
    constructName,
    `${constructName}.yaml`
  );
  const rootPath = path.join(
    process.cwd(),
    "..",
    "schemas",
    "constructs",
    version,
    `${constructName}.yaml`
  );

  const dirPath = fs.existsSync(subPath) ? subPath : rootPath;

  if (!fs.existsSync(dirPath)) return [];

  const content = fs.readFileSync(dirPath, "utf-8");
  const doc = yaml.load(content) as any;

  // Try OpenAPI format first: components.schemas.<name>
  const schemas = doc?.components?.schemas || {};
  let targetSchema = schemas[schemaObjName];

  // Fall back to JSON Schema format: definitions.<name>
  if (!targetSchema) {
    const definitions = doc?.definitions || {};
    targetSchema = definitions[schemaObjName];
  }

  // Fall back to direct properties in the document (Legacy)
  if (!targetSchema && doc?.[schemaObjName]) {
    targetSchema = doc[schemaObjName];
  }

  // Fall back to root document if it looks like the schema we want
  // (e.g. relationship.yaml in v1alpha1 IS the RelationshipDefinition)
  if (!targetSchema && doc?.properties) {
    if (
      schemaObjName.toLowerCase().includes(constructName.toLowerCase()) ||
      constructName.toLowerCase().includes(schemaObjName.toLowerCase())
    ) {
      targetSchema = doc;
    }
  }

  if (!targetSchema) return [];

  // If the schema itself is an array type, describe it at the top level
  if (targetSchema.type === "array" && targetSchema.items) {
    return extractProperties(targetSchema.items, [], path.dirname(dirPath));
  }

  if (!targetSchema.properties) return [];

  return extractProperties(targetSchema, targetSchema.required || [], path.dirname(dirPath));
}

function extractProperties(schema: any, requiredList: string[], basePath: string): any[] {
  const props = schema.properties || {};
  // Recursively collect from allOf if present
  let allProps: Record<string, any> = { ...props };
  if (schema.allOf) {
    for (const sub of schema.allOf) {
      if (sub.properties) {
        allProps = { ...allProps, ...sub.properties };
      }
    }
  }

  return Object.keys(allProps).map((fieldName) => {
    const prop = allProps[fieldName];
    let typeDisplay = prop.type || "";

    // Resolve local $ref if possible
    if (prop.$ref && prop.$ref.startsWith("./")) {
      const parts = prop.$ref.split("#");
      const refPath = path.resolve(basePath, parts[0]);
      if (fs.existsSync(refPath)) {
        try {
          const content = fs.readFileSync(refPath, "utf-8");
          const target = yaml.load(content) as any;
          const anchor = parts[1];
          let resolved = target;
          if (anchor) {
            if (anchor.startsWith("/")) {
              const pathParts = anchor.split("/").filter(Boolean);
              for (const p of pathParts) resolved = resolved?.[p];
            } else {
              resolved = target?.definitions?.[anchor] || target?.components?.schemas?.[anchor];
            }
          }
          typeDisplay = resolved?.type || `Ref: ${prop.$ref.split("/").pop()}`;
        } catch {
          typeDisplay = `Ref: ${prop.$ref.split("/").pop()}`;
        }
      } else {
        typeDisplay = `Ref: ${prop.$ref.split("/").pop()}`;
      }
    } else if (prop.$ref) {
      typeDisplay = `Ref: ${prop.$ref.split("/").pop()}`;
    } else if (prop.type === "array" && prop.items) {
      if (prop.items.$ref) {
        typeDisplay = `Array<${prop.items.$ref.split("/").pop()}>`;
      } else {
        typeDisplay = `Array<${prop.items.type || "any"}>`;
      }
    } else if (prop.enum) {
      typeDisplay = `enum: ${prop.enum.join(" | ")}`;
    }

    return {
      name: fieldName,
      type: typeDisplay,
      description: prop.description || "",
      required: requiredList.includes(fieldName) ? "Yes" : "No",
    };
  });
}

/**
 * Load a JSON template for a construct if it exists.
 */
export function loadTemplate(version: string, constructName: string) {
  const subPath = path.join(
    process.cwd(),
    "..",
    "schemas",
    "constructs",
    version,
    constructName,
    "templates",
    `${constructName}_template.json`
  );
  const rootPath = path.join(
    process.cwd(),
    "..",
    "schemas",
    "constructs",
    version,
    "templates",
    `${constructName}_template.json`
  );

  const dirPath = fs.existsSync(subPath) ? subPath : rootPath;
  if (!fs.existsSync(dirPath)) return null;

  try {
    const content = fs.readFileSync(dirPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Load full YAML doc and list all top-level definitions/schemas names.
 */
export function loadSchemaNames(version: string, constructName: string): string[] {
  const subPath = path.join(
    process.cwd(),
    "..",
    "schemas",
    "constructs",
    version,
    constructName,
    `${constructName}.yaml`
  );
  const rootPath = path.join(
    process.cwd(),
    "..",
    "schemas",
    "constructs",
    version,
    `${constructName}.yaml`
  );

  const dirPath = fs.existsSync(subPath) ? subPath : rootPath;
  if (!fs.existsSync(dirPath)) return [];

  const content = fs.readFileSync(dirPath, "utf-8");
  const doc = yaml.load(content) as any;

  const names: string[] = [];
  if (doc?.components?.schemas) {
    names.push(...Object.keys(doc.components.schemas));
  }
  if (doc?.definitions) {
    names.push(...Object.keys(doc.definitions));
  }
  return names;
}
