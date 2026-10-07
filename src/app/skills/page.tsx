import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { getSkillsByKind, meta } from "@/lib/data";
import styles from "./skills.module.css";

export const metadata: Metadata = {
  title: "Skills",
  description: `${meta.skills.total} skills: ${meta.skills.project} project skills, ${meta.skills.senior} deep-reference packs, and ${meta.skills.content} content system, loaded on demand.`,
};

function SkillGrid({ kind }: { kind: "project" | "senior" | "content" }) {
  const skills = getSkillsByKind(kind);
  return (
    <div className={styles.grid}>
      {skills.map((skill) => (
        <Link key={skill.name} href={`/skills/${skill.name}`} className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.name}>{skill.name}</span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </div>
          <p className={styles.description}>{skill.description}</p>
          <div className={styles.cardMeta}>
            <span className={styles.path}>{skill.path}</span>
            <span className={styles.refs}>{skill.references.length} refs</span>
          </div>
          {skill.version ? <span className={styles.version}>v{skill.version}</span> : null}
        </Link>
      ))}
    </div>
  );
}

export default function SkillsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Reference</p>
        <h1 className={styles.title}>Skills</h1>
        <p className={styles.lead}>
          Skills are loaded on demand by agents through the built-in skill tool. Project skills
          document specific products; senior skills are deep references for whole ecosystems;
          content skills run publishing systems.
        </p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Project skills</h2>
          <Badge>{meta.skills.project}</Badge>
        </div>
        <SkillGrid kind="project" />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Senior skills</h2>
          <Badge>{meta.skills.senior}</Badge>
        </div>
        <SkillGrid kind="senior" />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Content skills</h2>
          <Badge>{meta.skills.content}</Badge>
        </div>
        <SkillGrid kind="content" />
      </section>
    </div>
  );
}
