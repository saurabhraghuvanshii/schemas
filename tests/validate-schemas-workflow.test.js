const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");

const workflowPath = path.join(__dirname, "..", ".github", "workflows", "schema-audit.yml");

function readWorkflow() {
  return yaml.load(fs.readFileSync(workflowPath, "utf8"));
}

function findRunStep(job, runCommand) {
  return job.steps.find((step) => step.run === runCommand);
}

test("schema audit workflow only auto-triggers on construct schema changes", () => {
  const workflow = readWorkflow();

  assert.deepEqual(workflow.on.pull_request.paths, ["schemas/constructs/**"]);
  assert.deepEqual(workflow.on.push.paths, ["schemas/constructs/**"]);
});

test("schema audit workflow runs strict validation and full audit commands", () => {
  const workflow = readWorkflow();
  const jobs = Object.values(workflow.jobs);

  assert.ok(jobs.some((job) => findRunStep(job, "make validate-schemas-strict")));
  assert.ok(jobs.some((job) => findRunStep(job, "make audit-schemas-full")));
});
