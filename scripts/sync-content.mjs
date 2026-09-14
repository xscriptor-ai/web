#!/usr/bin/env node
// Sync agents and skills repos into static JSON for the site.
import {
  existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync,
  mkdtempSync, rmSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname, relative, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WORKSPACE = resolve(ROOT, "..");
const OUT_DIR = join(ROOT, "src", "data");
const REF = process.env.XSCRIPTOR_REF || "main";

const SOURCES = {
  agents: "https://github.com/xscriptor-ai/agents",
  skills: "https://github.com/xscriptor-ai/skills",
};

function findLocal(kind) {
  const envVar = kind === "agents" ? "XSCRIPTOR_AGENTS_DIR" : "XSCRIPTOR_SKILLS_DIR";
  if (process.env[envVar]) {
    const dir = resolve(process.env[envVar]);
    if (existsSync(dir)) return dir;
  }
  for (const candidate of [join(WORKSPACE, kind), join(ROOT, "..", kind)]) {
    if (kind === "agents" && existsSync(join(candidate, "agents"))) return candidate;
    if (kind === "skills" && existsSync(join(candidate, "senior", "skills"))) return candidate;
  }
  return null;
}

async function fetchRepo(repo) {
  const url = `https://codeload.github.com/${repo}/tar.gz/refs/heads/${REF}`;
  console.log(`  downloading ${repo}@${REF}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const dir = mkdtempSync(join(tmpdir(), "xscriptor-web-"));
  const tgz = join(dir, "src.tgz");
  writeFileSync(tgz, Buffer.from(await res.arrayBuffer()));
  try {
    execFileSync("tar", ["-xzf", tgz, "-C", dir, "--strip-components=1"], { stdio: "ignore" });
  } catch {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    execFileSync("git", ["clone", "--depth", "1", "--branch", REF, `https://github.com/${repo}.git`, dir], { stdio: "ignore" });
  }
  rmSync(tgz, { force: true });
  return dir;
}

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

async function mdToHtml(markdown) {
  const processed = await remark().use(remarkHtml).process(markdown);
  return String(processed);
}

function permValue(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return value["*"] ?? "ask";
  return "deny";
}

function parseSource(text) {
  const { data, content } = matter(text);
  return { data, content };
}

async function buildAgents(repoDir) {
  const index = [];
  const full = {};

  const bases = [
    { dir: join(repoDir, "agents"), kind: "specialized" },
    { dir: join(repoDir, "senior", "agents"), kind: "senior" },
  ];

  for (const { dir, kind } of bases) {
    for (const file of walk(dir)) {
      if (!file.endsWith(".md") || basename(file) === "README.md") continue;
      const rel = relative(dir, file).replaceAll("\\", "/");
      const group = dirname(rel) === "." ? "general" : dirname(rel);
      const slug = basename(file, ".md");
      const { data, content } = parseSource(readFileSync(file, "utf8"));
      const permission = data.permission ?? null;
      const edit = permValue(permission?.edit ?? "deny");
      const bash = permValue(permission?.bash ?? "deny");
      const source = `${SOURCES.agents}/blob/main/${kind === "senior" ? "senior/agents" : "agents"}/${rel}`;

      index.push({
        slug,
        name: slug,
        description: String(data.description ?? "").trim(),
        group,
        kind,
        color: typeof data.color === "string" ? data.color : null,
        mode: typeof data.mode === "string" ? data.mode : null,
        temperature: typeof data.temperature === "number" ? data.temperature : null,
        readonly: edit === "deny" && bash === "deny",
        edit,
        bash,
        source,
      });

      full[slug] = {
        slug,
        body: await mdToHtml(content),
        permission,
      };
    }
  }

  index.sort((a, b) => (a.group === b.group ? a.slug.localeCompare(b.slug) : a.group.localeCompare(b.group)));

  const groups = [...index.reduce((map, agent) => {
    map.set(agent.group, (map.get(agent.group) ?? 0) + 1);
    return map;
  }, new Map()).entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { index, full, groups };
}

async function buildSkills(repoDir) {
  const skills = [];

  const seniorRoot = join(repoDir, "senior", "skills");
  for (const entry of existsSync(seniorRoot) ? readdirSync(seniorRoot) : []) {
    const skillFile = join(seniorRoot, entry, "SKILL.md");
    if (!existsSync(skillFile)) continue;
    skills.push(await parseSkill(skillFile, "senior", `senior/skills/${entry}`, SOURCES.skills));
  }

  const projectRoot = join(repoDir, "skills");
  for (const file of walk(projectRoot)) {
    if (basename(file) !== "SKILL.md") continue;
    const rel = relative(projectRoot, dirname(file)).replaceAll("\\", "/");
    const name = basename(dirname(file));
    skills.push(await parseSkill(file, "project", `skills/${rel}`, SOURCES.skills, name));
  }

  return skills.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind.localeCompare(b.kind)));
}

async function parseSkill(file, kind, path, repo, nameOverride) {
  const { data, content } = parseSource(readFileSync(file, "utf8"));
  const dir = dirname(file);
  const name = nameOverride ?? basename(dir);
  const references = [];
  const refsDir = join(dir, "references");
  for (const ref of walk(refsDir)) {
    if (!ref.endsWith(".md")) continue;
    references.push({
      name: basename(ref, ".md"),
      body: await mdToHtml(readFileSync(ref, "utf8")),
    });
  }
  references.sort((a, b) => a.name.localeCompare(b.name));
  return {
    name,
    description: String(data.description ?? "").trim(),
    kind,
    version: data.version ? String(data.version) : null,
    path,
    references,
    body: await mdToHtml(content),
    source: `${repo}/blob/main/${path}/SKILL.md`,
  };
}

async function buildCommands(repoDir) {
  const commandsDir = join(repoDir, "commands");
  const commands = [];
  for (const file of existsSync(commandsDir) ? readdirSync(commandsDir) : []) {
    if (!file.endsWith(".md") || file === "README.md") continue;
    const path = join(commandsDir, file);
    const { data, content } = parseSource(readFileSync(path, "utf8"));
    commands.push({
      name: basename(file, ".md"),
      description: String(data.description ?? "").trim(),
      agent: data.agent ? String(data.agent) : null,
      subtask: data.subtask === true,
      body: await mdToHtml(content),
      source: `${SOURCES.skills}/blob/main/commands/${file}`,
    });
  }
  return commands.sort((a, b) => a.name.localeCompare(b.name));
}

async function main() {
  console.log("==> Syncing xscriptor-ai content");

  let agentsRepo = findLocal("agents");
  let skillsRepo = findLocal("skills");

  if (agentsRepo) console.log(`    agents: local ${agentsRepo}`);
  else {
    agentsRepo = await fetchRepo("xscriptor-ai/agents");
    console.log(`    agents: downloaded ${agentsRepo}`);
  }

  if (skillsRepo) console.log(`    skills: local ${skillsRepo}`);
  else {
    skillsRepo = await fetchRepo("xscriptor-ai/skills");
    console.log(`    skills: downloaded ${skillsRepo}`);
  }

  const { index, full, groups } = await buildAgents(agentsRepo);
  const skills = await buildSkills(skillsRepo);
  const commands = await buildCommands(skillsRepo);

  const meta = {
    generatedAt: new Date().toISOString(),
    ref: REF,
    agents: {
      total: index.length,
      specialized: index.filter((agent) => agent.kind === "specialized").length,
      senior: index.filter((agent) => agent.kind === "senior").length,
    },
    skills: {
      total: skills.length,
      project: skills.filter((skill) => skill.kind === "project").length,
      senior: skills.filter((skill) => skill.kind === "senior").length,
    },
    commands: commands.length,
    groups,
    sources: SOURCES,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "agents-index.json"), JSON.stringify(index));
  writeFileSync(join(OUT_DIR, "agents-full.json"), JSON.stringify(full));
  writeFileSync(join(OUT_DIR, "skills.json"), JSON.stringify(skills));
  writeFileSync(join(OUT_DIR, "commands.json"), JSON.stringify(commands));
  writeFileSync(join(OUT_DIR, "meta.json"), JSON.stringify(meta, null, 2));

  console.log(`    agents: ${meta.agents.total} (${meta.agents.specialized} specialized, ${meta.agents.senior} senior)`);
  console.log(`    skills: ${meta.skills.total} (${meta.skills.project} project, ${meta.skills.senior} senior)`);
  console.log(`    commands: ${meta.commands}`);
  console.log(`    groups: ${groups.length}`);
  console.log(`==> Wrote ${relative(ROOT, OUT_DIR)}/`);
}

main().catch((error) => {
  console.error(`error: ${error.message}`);
  process.exit(1);
});
