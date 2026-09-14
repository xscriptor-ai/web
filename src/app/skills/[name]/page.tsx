import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { MarkdownBody } from "@/components/MarkdownBody";
import { skills } from "@/lib/data";
import styles from "./skill.module.css";

export function generateStaticParams() {
  return skills.map((skill) => ({ name: skill.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const skill = skills.find((item) => item.name === name);
  if (!skill) return { title: "Skill not found" };
  return { title: `skill ${skill.name}`, description: skill.description };
}

export default async function SkillPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const skill = skills.find((item) => item.name === name);
  if (!skill) notFound();

  return (
    <article className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/skills">Skills</Link>
        <span aria-hidden="true">/</span>
        <span>{skill.name}</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{skill.name}</h1>
        <p className={styles.description}>{skill.description}</p>
        <div className={styles.badges}>
          <Badge tone="primary">{skill.kind}</Badge>
          {skill.version ? <Badge>v{skill.version}</Badge> : null}
          <Badge>{skill.path}</Badge>
        </div>
        <a className={styles.source} href={skill.source} target="_blank" rel="noreferrer">
          View source on GitHub
        </a>
      </header>

      <section className={styles.body}>
        <MarkdownBody html={skill.body} />
      </section>

      {skill.references.length > 0 ? (
        <section className={styles.references}>
          <h2 className={styles.referencesTitle}>References ({skill.references.length})</h2>
          <div className={styles.referenceList}>
            {skill.references.map((reference) => (
              <details key={reference.name} className={styles.reference}>
                <summary className={styles.referenceSummary}>
                  <span className={styles.referenceName}>{reference.name}</span>
                  <span className={styles.referenceHint} aria-hidden="true">
                    expand
                  </span>
                </summary>
                <div className={styles.referenceBody}>
                  <MarkdownBody html={reference.body} />
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
