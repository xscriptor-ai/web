export type AgentKind = "specialized" | "senior";
export type SkillKind = "project" | "senior" | "content";

export interface AgentIndex {
  slug: string;
  name: string;
  description: string;
  group: string;
  kind: AgentKind;
  color: string | null;
  mode: string | null;
  temperature: number | null;
  readonly: boolean;
  edit: string;
  bash: string;
  source: string;
}

export interface AgentDetail {
  slug: string;
  body: string;
  permission: Record<string, unknown> | null;
}

export interface SkillReference {
  name: string;
  body: string;
}

export interface Skill {
  name: string;
  description: string;
  kind: SkillKind;
  version: string | null;
  path: string;
  references: SkillReference[];
  body: string;
  source: string;
}

export interface Command {
  name: string;
  description: string;
  agent: string | null;
  subtask: boolean;
  body: string;
  source: string;
}

export interface GroupInfo {
  name: string;
  count: number;
}

export interface Meta {
  generatedAt: string;
  ref: string;
  agents: { total: number; specialized: number; senior: number };
  skills: { total: number; project: number; senior: number; content: number };
  commands: number;
  groups: GroupInfo[];
  sources: { agents: string; skills: string };
}
