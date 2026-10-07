import Link from "next/link";
import { meta } from "@/lib/data";
import styles from "./Footer.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const columns = [
  {
    title: "Browse",
    links: [
      { label: "Agents", href: "/agents" },
      { label: "Skills", href: "/skills" },
      { label: "Commands", href: "/commands" },
      { label: "Installation", href: "/docs" },
    ],
  },
  {
    title: "Repositories",
    links: [
      { label: "agents", href: "https://github.com/xscriptor-ai/agents", external: true },
      { label: "skills", href: "https://github.com/xscriptor-ai/skills", external: true },
      { label: "environments", href: "https://github.com/xscriptor-ai/environments", external: true },
      { label: "packages", href: "https://github.com/xscriptor-ai/packages", external: true },
      { label: "scripts", href: "https://github.com/xscriptor-ai/scripts", external: true },
      { label: "research", href: "https://github.com/xscriptor-ai/research", external: true },
    ],
  },
  {
    title: "Packages",
    links: [
      { label: "@xscriptor/ai-agents", href: "https://www.npmjs.com/package/@xscriptor/ai-agents", external: true },
      { label: "@xscriptor/skill-xscriptor", href: "https://www.npmjs.com/package/@xscriptor/skill-xscriptor", external: true },
      { label: "@xscriptor/skill-devx", href: "https://www.npmjs.com/package/@xscriptor/skill-devx", external: true },
      { label: "@xscriptor/skill-samurai", href: "https://www.npmjs.com/package/@xscriptor/skill-samurai", external: true },
      { label: "@xscriptor/skill-xglassmorphism", href: "https://www.npmjs.com/package/@xscriptor/skill-xglassmorphism", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <div className={styles.brand}>
            <img className={styles.logo} src={`${basePath}/logo-glyph.svg`} alt="" width={28} height={28} />
            <span className={styles.wordmark}>
              xscriptor<span className={styles.wordmarkDim}>-ai</span>
            </span>
          </div>
          <p className={styles.tagline}>
            Agents, skills, and commands for OpenCode and Claude Code. MIT licensed and built in the
            open.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className={styles.column}>
            <h3 className={styles.title}>{column.title}</h3>
            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.label}>
                  {"external" in link && link.external ? (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.legal}>
        <span>xscriptor-ai · MIT</span>
        <span>
          Content synced {new Date(meta.generatedAt).toISOString().slice(0, 10)} · ref {meta.ref}
        </span>
      </div>
    </footer>
  );
}
