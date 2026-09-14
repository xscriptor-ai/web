import type { Metadata } from "next";
import { AgentCatalog } from "@/components/AgentCatalog";
import { agents, meta } from "@/lib/data";
import styles from "./agents.module.css";

export const metadata: Metadata = {
  title: "Agents",
  description: `Browse all ${meta.agents.total} AI agents: ${meta.agents.specialized} specialized and ${meta.agents.senior} senior, organized in ${meta.groups.length} groups.`,
};

export default function AgentsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Catalog</p>
        <h1 className={styles.title}>Agents</h1>
        <p className={styles.description}>
          {meta.agents.specialized} specialized agents across {meta.groups.length} groups, plus{" "}
          {meta.agents.senior} senior agents that consolidate entire ecosystems. Filter by group or
          search by intent.
        </p>
      </header>
      <AgentCatalog agents={agents} groups={meta.groups} />
    </div>
  );
}
