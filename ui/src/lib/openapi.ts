import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const SCHEMAS_BASE = path.join(process.cwd(), "..", "schemas", "constructs");

export interface ConstructInfo {
  name: string;
  title: string;
  description: string;
  version: string;
  deprecated: boolean;
  hasEndpoints: boolean;
  endpointCount: number;
  schemaCount: number;
}

export interface EndpointInfo {
  path: string;
  method: string;
  operationId: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: ParameterInfo[];
  requestBody: RequestBodyInfo | null;
  responses: ResponseInfo[];
}

export interface ParameterInfo {
  name: string;
  in: string;
  required: boolean;
  description: string;
  type: string;
}

export interface RequestBodyInfo {
  required: boolean;
  schemaRef: string;
  description: string;
}

export interface ResponseInfo {
  code: string;
  description: string;
  schemaRef: string;
}

export interface SchemaInfo {
  name: string;
  type: string;
  description: string;
  properties: PropertyInfo[];
  required: string[];
  isRef: boolean;
  refTarget: string;
  enumValues: string[];
}

export interface PropertyInfo {
  name: string;
  type: string;
  description: string;
  required: boolean;
  format: string;
  enumValues: string[];
  ref: string;
}

/**
 * Get all available schema versions.
 */
export function getVersions(): string[] {
  if (!fs.existsSync(SCHEMAS_BASE)) return [];
  const dirs = fs.readdirSync(SCHEMAS_BASE, { withFileTypes: true });
  return dirs
    .filter((dir) => dir.isDirectory() && dir.name.startsWith("v1"))
    .map((dir) => dir.name)
    .sort();
}

/**
 * List all constructs that have an api.yml for a given version.
 */
export function listConstructs(version: string): ConstructInfo[] {
  const versionPath = path.join(SCHEMAS_BASE, version);
  if (!fs.existsSync(versionPath)) return [];

  const items = fs.readdirSync(versionPath, { withFileTypes: true });
  const results: ConstructInfo[] = [];
  const foundDirectories = new Set<string>();

  // 1. Scan subdirectories with api.yml (Standard structure)
  for (const item of items) {
    if (!item.isDirectory()) continue;
    
    const apiPath = path.join(versionPath, item.name, "api.yml");
    if (!fs.existsSync(apiPath)) continue;

    foundDirectories.add(item.name);
    try {
      const content = fs.readFileSync(apiPath, "utf-8");
      const doc = yaml.load(content) as any;

      const pathKeys = doc?.paths ? Object.keys(doc.paths) : [];
      let endpointCount = 0;
      for (const p of pathKeys) {
        endpointCount += Object.keys(doc.paths[p]).filter(m =>
          ["get", "post", "put", "patch", "delete"].includes(m)
        ).length;
      }

      const schemaKeys = doc?.components?.schemas ? Object.keys(doc.components.schemas) : [];

      results.push({
        name: item.name,
        title: doc?.info?.title || item.name,
        description: doc?.info?.description || "",
        version: doc?.info?.version || version,
        deprecated: !!doc?.info?.["x-deprecated"],
        hasEndpoints: endpointCount > 0,
        endpointCount,
        schemaCount: schemaKeys.length,
      });
    } catch {
      // skip malformed
    }
  }

  // 2. Scan root files for legacy or schema-only constructs (Legacy structure)
  // e.g. v1alpha1/relationship.yaml
  for (const item of items) {
    if (!item.isFile() || !item.name.endsWith(".yaml") || item.name === "api.yml") continue;
    
    const constructName = item.name.replace(".yaml", "");
    if (foundDirectories.has(constructName)) continue;

    try {
      const content = fs.readFileSync(path.join(versionPath, item.name), "utf-8");
      const doc = yaml.load(content) as any;

      results.push({
        name: constructName,
        title: doc?.title || constructName,
        description: doc?.description || "",
        version: version,
        deprecated: !!doc?.deprecated,
        hasEndpoints: false,
        endpointCount: 0,
        schemaCount: doc.definitions ? Object.keys(doc.definitions).length : 1,
      });
    } catch {
      // skip
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Parse full OpenAPI spec for a given construct and version.
 */
export function parseConstructSpec(version: string, constructName: string): {
  info: any;
  endpoints: EndpointInfo[];
  schemas: SchemaInfo[];
} | null {
  const versionPath = path.join(SCHEMAS_BASE, version);
  const apiPath = path.join(versionPath, constructName, "api.yml");
  const rootYamlPath = path.join(versionPath, `${constructName}.yaml`);

  let doc: any = null;
  let basePath = "";

  if (fs.existsSync(apiPath)) {
    doc = yaml.load(fs.readFileSync(apiPath, "utf-8")) as any;
    basePath = path.join(versionPath, constructName);
  } else if (fs.existsSync(rootYamlPath)) {
    // Legacy schema-only construct
    const content = fs.readFileSync(rootYamlPath, "utf-8");
    const docContent = yaml.load(content) as any;
    doc = {
      info: {
        title: docContent.title || constructName,
        description: docContent.description || "",
        version: version,
      },
      components: {
        schemas: {
          [constructName]: docContent,
        },
      },
      paths: {},
    };
    basePath = versionPath;
  }

  if (!doc) return null;

  try {
    // Parse endpoints
    const endpoints: EndpointInfo[] = [];
    const paths = doc?.paths || {};
    for (const [pathStr, methods] of Object.entries(paths)) {
      if (pathStr === "{}" || !methods) continue;
      const methodsObj = methods as any;
      for (const [method, op] of Object.entries(methodsObj)) {
        if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;
        const opObj = op as any;

        // Parse parameters
        const params: ParameterInfo[] = [];
        for (const p of opObj.parameters || []) {
          if (p.$ref) {
            const refName = p.$ref.split("/").pop() || "";
            params.push({
              name: refName,
              in: "ref",
              required: false,
              description: `→ ${p.$ref}`,
              type: "ref",
            });
          } else {
            params.push({
              name: p.name || "",
              in: p.in || "",
              required: !!p.required,
              description: p.description || "",
              type: p.schema?.type || (p.schema?.$ref ? `Ref: ${p.schema.$ref.split("/").pop()}` : ""),
            });
          }
        }

        // Parse request body
        let requestBody: RequestBodyInfo | null = null;
        if (opObj.requestBody) {
          const rb = opObj.requestBody;
          const jsonSchema = rb.content?.["application/json"]?.schema;
          requestBody = {
            required: !!rb.required,
            schemaRef: jsonSchema?.$ref?.split("/").pop() || jsonSchema?.type || "",
            description: rb.description || "",
          };
        }

        // Parse responses
        const responses: ResponseInfo[] = [];
        for (const [code, resp] of Object.entries(opObj.responses || {})) {
          const respObj = resp as any;
          let schemaRef = "";
          if (respObj.$ref) {
            schemaRef = respObj.$ref.split("/").pop() || "";
          } else {
            const jsonSchema = respObj.content?.["application/json"]?.schema;
            if (jsonSchema?.$ref) {
              schemaRef = jsonSchema.$ref.split("/").pop() || "";
            } else if (jsonSchema?.type === "array" && jsonSchema.items?.$ref) {
              schemaRef = `Array<${jsonSchema.items.$ref.split("/").pop()}>`;
            } else if (jsonSchema?.type) {
              schemaRef = jsonSchema.type;
            }
          }
          responses.push({
            code,
            description: respObj.description || "",
            schemaRef,
          });
        }

        endpoints.push({
          path: pathStr,
          method: method.toUpperCase(),
          operationId: opObj.operationId || "",
          summary: opObj.summary || "",
          description: opObj.description || "",
          tags: opObj.tags || [],
          parameters: params,
          requestBody,
          responses,
        });
      }
    }
    // Parse schemas
    const schemas: SchemaInfo[] = [];
    const resolveRef = (ref: string, currentPath: string): any => {
      if (!ref.startsWith("./")) return null;
      const parts = ref.split("#");
      const relativePath = parts[0];
      const anchor = parts[1];
      const targetPath = path.resolve(currentPath, relativePath);
      if (!fs.existsSync(targetPath)) return null;
      
      try {
        const content = fs.readFileSync(targetPath, "utf-8");
        const yamlContent = yaml.load(content) as any;
        if (!anchor) return yamlContent;
        // Basic anchor resolution
        if (anchor.startsWith("/")) {
          const pathParts = anchor.split("/").filter(Boolean);
          let current = yamlContent;
          for (const p of pathParts) {
            current = current?.[p];
          }
          return current;
        }
        return yamlContent?.definitions?.[anchor] || yamlContent?.components?.schemas?.[anchor];
      } catch {
        return null;
      }
    };

    const schemaDefs = doc?.components?.schemas || {};
    for (const [name, schema] of Object.entries(schemaDefs)) {
      let s = schema as any;

      // Follow ref if this is a top-level ref to another file
      if (s.$ref) {
        const resolved = resolveRef(s.$ref, basePath);
        if (resolved) {
          s = resolved;
        } else {
          schemas.push({
            name,
            type: "ref",
            description: "",
            properties: [],
            required: [],
            isRef: true,
            refTarget: s.$ref,
            enumValues: [],
          });
          continue;
        }
      }

      const properties: PropertyInfo[] = [];
      const requiredFields: string[] = s.required || [];

      if (s.properties) {
        for (const [propName, prop] of Object.entries(s.properties)) {
          const p = prop as any;
          let typeStr = p.type || "";
          if (p.$ref) {
            typeStr = `Ref: ${p.$ref.split("/").pop()}`;
          } else if (p.type === "array" && p.items) {
            if (p.items.$ref) {
              typeStr = `Array<${p.items.$ref.split("/").pop()}>`;
            } else {
              typeStr = `Array<${p.items.type || "any"}>`;
            }
          }

          properties.push({
            name: propName,
            type: typeStr,
            description: p.description || "",
            required: requiredFields.includes(propName),
            format: p.format || "",
            enumValues: p.enum || [],
            ref: p.$ref || "",
          });
        }
      }

      schemas.push({
        name,
        type: s.type || "object",
        description: s.description || "",
        properties,
        required: requiredFields,
        isRef: false,
        refTarget: "",
        enumValues: s.enum || [],
      });
    }

    return {
      info: doc.info || {},
      endpoints,
      schemas,
    };
  } catch {
    return null;
  }
}
