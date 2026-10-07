import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { CopyButton } from "@/components/CopyButton";
import { MarkdownBody } from "@/components/MarkdownBody";
import { commands, meta } from "@/lib/data";
import styles from "./commands.module.css";

export const metadata: Metadata = {
  title: "Commands",
  description: `${meta.commands} slash commands that delegate to agents: /x-review, /x-audit, /x-docs, /x-arch, /x-test, /x-deploy, /x-refactor, /x-design.`,
};

export default function CommandsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Workflows</p>
        <h1 className={styles.title}>Commands</h1>
        <p className={styles.lead}>
          {meta.commands} slash commands for common workflows. Each one delegates to a specialized
          agent through the task tool, or runs directly in the primary session.
        </p>
      </header>

      <div className={styles.list}>
        {commands.map((command) => (
          <article key={command.name} className={styles.command}>
            <header className={styles.bar}>
              <span className={styles.tag}>[ cmd ]</span>
              <code className={styles.name}>$ /{command.name}</code>
              <CopyButton value={`/${command.name}`} />
            </header>
            <div className={styles.body}>
              <p className={styles.description}>{command.description}</p>
              <div className={styles.badges}>
                {command.agent ? <Badge tone="primary">@{command.agent}</Badge> : null}
                {command.subtask ? <Badge>subtask</Badge> : null}
                <a className={styles.source} href={command.source} target="_blank" rel="noreferrer">
                  source
                </a>
              </div>
              <details className={styles.prompt}>
                <summary className={styles.summary}>Prompt</summary>
                <div className={styles.promptBody}>
                  <MarkdownBody html={command.body} />
                </div>
              </details>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
