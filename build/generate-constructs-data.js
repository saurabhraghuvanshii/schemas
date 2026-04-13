#!/usr/bin/env node
/**
 * Scans schemas/constructs/ and generates _data/constructs.json
 * so the Jekyll site always reflects the actual schema directory structure.
 *
 * No external dependencies — uses only Node built-in modules.
 *
 * Output shape:
 * {
 *   "versions": ["v1beta2", "v1beta1", ...],      // sorted latest-first
 *   "items": [
 *     {
 *       "name": "connection",
 *       "description": "Meshery Connections are managed and ...",
 *       "versions": ["v1beta2", "v1beta1"],
 *       "latestVersion": "v1beta2",
 *       "hasApi": true,
 *       "hasTemplate": true
 *     }
 *   ]
 * }
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONSTRUCTS_DIR = path.join(ROOT, 'schemas', 'constructs');
const OUT_FILE = path.join(ROOT, '_data', 'constructs.json');

// Version ordering: higher = newer.  v1beta2 > v1beta1 > v1alpha3 > v1alpha2 > v1alpha1
function versionRank(v) {
  const m = v.match(/^v(\d+)(alpha|beta)(\d+)$/);
  if (!m) return 0;
  const major = parseInt(m[1], 10);
  const stage = m[2] === 'beta' ? 1000 : 0;
  const minor = parseInt(m[3], 10);
  return major * 10000 + stage + minor;
}

// Extract top-level description from a YAML file without a YAML parser.
function extractDescription(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    // Match description: <value> at the start of a line (top-level key)
    const match = text.match(/^description:\s*(.+)/m);
    if (match) {
      let desc = match[1].trim();
      // Strip YAML flow indicators and trailing refs
      if (desc.startsWith('>-') || desc.startsWith('|') || desc.startsWith('>')) {
        // Multi-line scalar — grab next indented lines
        const lines = text.split('\n');
        const idx = lines.findIndex(l => /^description:/.test(l));
        if (idx !== -1) {
          const parts = [];
          for (let i = idx + 1; i < lines.length; i++) {
            if (/^\s+/.test(lines[i]) && !/^\S/.test(lines[i])) {
              parts.push(lines[i].trim());
            } else {
              break;
            }
          }
          desc = parts.join(' ');
        }
      }
      // Truncate long descriptions
      if (desc.length > 200) desc = desc.slice(0, 197) + '...';
      return desc;
    }
  } catch (_) {
    // file unreadable
  }
  return '';
}

// --- Main ---

// 1) Discover version directories
const versionDirs = fs.readdirSync(CONSTRUCTS_DIR)
  .filter(d => fs.statSync(path.join(CONSTRUCTS_DIR, d)).isDirectory())
  .sort((a, b) => versionRank(b) - versionRank(a));

// 2) Walk each version and collect construct info
const constructMap = {}; // name -> { description, versions[], hasApi, hasTemplate }

for (const ver of versionDirs) {
  const verPath = path.join(CONSTRUCTS_DIR, ver);
  const entries = fs.readdirSync(verPath).filter(d => {
    // Only directories, skip 'core' (shared types, not a construct)
    return fs.statSync(path.join(verPath, d)).isDirectory() && d !== 'core';
  });

  for (const name of entries) {
    const cPath = path.join(verPath, name);

    if (!constructMap[name]) {
      constructMap[name] = {
        name,
        description: '',
        versions: [],
        hasApi: false,
        hasTemplate: false,
      };
    }

    constructMap[name].versions.push(ver);

    // Try to get description from entity YAML (prefer latest version)
    const entityYaml = path.join(cPath, name + '.yaml');
    if (fs.existsSync(entityYaml) && !constructMap[name].description) {
      constructMap[name].description = extractDescription(entityYaml);
    }

    // Check for api.yml
    if (fs.existsSync(path.join(cPath, 'api.yml'))) {
      constructMap[name].hasApi = true;
    }

    // Check for templates
    const tplDir = path.join(cPath, 'templates');
    if (fs.existsSync(tplDir) && fs.statSync(tplDir).isDirectory()) {
      constructMap[name].hasTemplate = true;
    }
  }
}

// 3) Sort each construct's versions (latest first) and pick latestVersion
const items = Object.values(constructMap)
  .map(c => {
    c.versions.sort((a, b) => versionRank(b) - versionRank(a));
    c.latestVersion = c.versions[0];
    return c;
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// 4) Write output
const output = {
  versions: versionDirs,
  items,
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n');

console.log(
  'Generated _data/constructs.json — %d versions, %d constructs',
  versionDirs.length,
  items.length
);
