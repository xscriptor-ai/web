import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fullJson from "@/data/agents-full.json";
import { Badge } from "@/components/Badge";
import { CopyButton } from "@/components/CopyButton";
import { MarkdownBody } from "@/components/MarkdownBody";
import { agents, colorToCss, formatTemperature } from "@/lib/data";
import styles from "./agent.module.css";

type FullAgent = {
  slug: string;
  body: string;
  permission: Record<string, unknown> | null;
};

const full = fullJson as unknown as Record<string, FullAgent>;

export function generateStaticParams() {
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = agents.find((item) => item.slug === slug);
  if (!agent) return { title: "Agent not found" };
  return { title: agent.name, description: agent.description };
}

function permissionRows(permission: Record<string, unknown> | null) {
  if (!permission) return [];
  return Object.entries(permission).map(([tool, value]) => {
    if (typeof value === "string") return { tool, mode: value, patterns: [] as string[] };
    if (value && typeof value === "object") {
      const map = value as Record<string, string>;
      const patterns = Object.keys(map).filter((key) => map[key] === "allow" && key !== "*");
      return { tool, mode: map["*"] ?? "ask", patterns };
    }
    return { tool, mode: "deny", patterns: [] as string[] };
  });
}

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = agents.find((item) => item.slug === slug);
  const detail = full[slug];
  if (!agent || !detail) notFound();

  const temperature = formatTemperature(agent.temperature);
  const rows = permissionRows(detail.permission);
  const related = agents.filter((item) => item.group === agent.group && item.slug !== agent.slug).slice(0, 8);

  return (
    <article className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/agents">Agents</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/agents?group=${encodeURIComponent(agent.group)}`}>{agent.group}</Link>
        <span aria-hidden="true">/</span>
        <span>{agent.name}</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.dot} style={{ background: colorToCss(agent.color) }} aria-hidden="true" />
          <h1 className={styles.title}>{agent.name}</h1>
        </div>
        <p className={styles.description}>{agent.description}</p>
        <div className={styles.badges}>
          <Badge tone="primary">{agent.kind}</Badge>
          <Badge>{agent.group}</Badge>
          {agent.mode ? <Badge>mode {agent.mode}</Badge> : null}
          {temperature ? <Badge>temp {temperature}</Badge> : null}
          {agent.readonly ? <Badge tone="primary">read-only</Badge> : null}
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.content}>
          <MarkdownBody html={detail.body} />

          {related.length > 0 ? (
            <section className={styles.related}>
              <h2 className={styles.relatedTitle}>More in {agent.group}</h2>
              <div className={styles.relatedList}>
                {related.map((item) => (
                  <Link key={item.slug} href={`/agents/${item.slug}`} className={styles.relatedChip}>
                    <span className={styles.relatedDot} style={{ background: colorToCss(item.color) }} aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
                <Link href={`/agents?group=${encodeURIComponent(agent.group)}`} className={styles.relatedMore}>
                  View group →
                </Link>
              </div>
            </section>
          ) : null}
        </div>

        <aside className={styles.sidebar} aria-label="Agent metadata">
          <div className={styles.panel}>
            <span className={styles.panelLabel}>Mention</span>
            <div className={styles.mention}>
              <code>@{agent.name}</code>
              <CopyButton value={`@${agent.name}`} />
            </div>

            <span className={styles.panelLabel}>Details</span>
            <dl className={styles.meta}>
              <div>
                <dt>Kind</dt>
                <dd>{agent.kind}</dd>
              </div>
              <div>
                <dt>Group</dt>
                <dd>
                  <Link href={`/agents?group=${encodeURIComponent(agent.group)}`}>{agent.group}</Link>
                </dd>
              </div>
              {agent.mode ? (
                <div>
                  <dt>Mode</dt>
                  <dd>{agent.mode}</dd>
                </div>
              ) : null}
              {temperature ? (
                <div>
                  <dt>Temp</dt>
                  <dd>{temperature}</dd>
                </div>
              ) : null}
              <div>
                <dt>Edit</dt>
                <dd>{agent.edit}</dd>
              </div>
              <div>
                <dt>Bash</dt>
                <dd>{agent.bash}</dd>
              </div>
            </dl>

            {rows.length > 0 ? (
              <>
                <span className={styles.panelLabel}>Permissions</span>
                <ul className={styles.permissions}>
                  {rows.map((row) => (
                    <li key={row.tool}>
                      <span className={styles.permTool}>{row.tool}</span>
                      <span className={styles.permMode}>{row.mode}</span>
                      {row.patterns.length > 0 ? (
                        <span className={styles.permPatterns}>{row.patterns.join(" · ")}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <a className={styles.source} href={agent.source} target="_blank" rel="noreferrer">
              View source on GitHub
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
