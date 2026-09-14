import agentsJson from "@/data/agents-index.json";
import commandsJson from "@/data/commands.json";
import metaJson from "@/data/meta.json";
import skillsJson from "@/data/skills.json";
import type { AgentIndex, Command, Meta, Skill } from "./types";

export const meta = metaJson as Meta;
export const agents = agentsJson as AgentIndex[];
export const skills = skillsJson as unknown as Skill[];
export const commands = commandsJson as unknown as Command[];

export const agentGroups = meta.groups;

export const seniorGroups = [...new Set(
  agents.filter((agent) => agent.kind === "senior").map((agent) => agent.group),
)].sort();

export function getSkillsByKind(kind: Skill["kind"]): Skill[] {
  return skills.filter((skill) => skill.kind === kind);
}

export function formatTemperature(value: number | null): string | null {
  return value === null ? null : value.toFixed(1);
}

const COLOR_TOKENS: Record<string, string> = {
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  success: "#22c55e",
  primary: "#84cc16",
  accent: "#a855f7",
  secondary: "#06b6d4",
};

export function colorToCss(color: string | null): string {
  if (!color) return "var(--border)";
  if (color.startsWith("#")) return color;
  return COLOR_TOKENS[color] ?? "var(--border)";
}
