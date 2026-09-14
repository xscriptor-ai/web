import Link from "next/link";
import { meta } from "@/lib/data";
import { TerminalWindow } from "@/components/TerminalWindow";
import styles from "./home.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const installCommand = "npx @xscriptor/ai-agents";

const installOutput = [
  "✓ 181 specialized agents · 24 senior agents",
  "✓ 21 skills · 8 commands",
  "→ ~/.config/opencode/",
];

const steps = [
  {
    title: "Install",
    body: "One command with npx, or clone the repos and run the installer. Agents, skills, and commands land in your OpenCode or Claude Code config.",
  },
  {
    title: "Pick an agent",
    body: "Search the catalog by intent or filter by group. Every agent documents its permissions, temperature, and scope before you run it.",
  },
  {
    title: "Ship",
    body: "Mention the agent in your session and hand over the task. Senior agents consolidate whole ecosystems into a single focused teammate.",
  },
];

const collectionCards = [
  {
    href: "/skills",
    title: "Skills",
    body: `${meta.skills.project} project skills and ${meta.skills.senior} deep-reference skills, loaded on demand.`,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z" />
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H19" />
      </svg>
    ),
  },
  {
    href: "/commands",
    title: "Commands",
    body: `${meta.commands} slash commands like /review, /audit, and /docs that delegate to the right agent.`,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 8 4 4-4 4" />
        <path d="M12 16h7" />
      </svg>
    ),
  },
  {
    href: "/docs",
    title: "Docs",
    body: "Install for OpenCode or Claude Code, scope to a project, update, and uninstall cleanly.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 3v5h5" />
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const topGroups = [...meta.groups].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 12);
  const marqueeItems = [...meta.groups].sort((a, b) => a.name.localeCompare(b.name));
  const stats = [
    { value: meta.agents.specialized, label: "specialized" },
    { value: meta.agents.senior, label: "senior" },
    { value: meta.groups.length, label: "groups" },
    { value: meta.skills.total, label: "skills" },
    { value: meta.commands, label: "commands" },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <img className={styles.eyebrowLogo} src={`${basePath}/logo-glyph.png`} alt="" width={14} height={14} />
            OpenCode + Claude Code
          </p>
          <h1 className={styles.title}>
            Install a full
            <br />
            <span className={styles.titleAccent}>engineering team.</span>
          </h1>
          <p className={styles.lead}>
            {meta.agents.total} agents, {meta.skills.total} skills, and {meta.commands} slash
            commands covering security, cloud, web, data, compliance, and systems. Markdown-first,
            model-agnostic, MIT licensed.
          </p>
          <div className={styles.actions}>
            <Link href="/agents" className={styles.primaryButton}>
              Browse agents
            </Link>
            <Link href="/docs" className={styles.secondaryButton}>
              Read the docs
            </Link>
          </div>
        </div>
        <div className={styles.terminalWrap}>
          <TerminalWindow command={installCommand} output={installOutput} />
        </div>
      </section>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((group, index) => (
            <span key={`${group.name}-${index}`} className={styles.marqueeItem}>
              {group.name} <b>{group.count}</b>
            </span>
          ))}
        </div>
      </div>

      <section className={styles.stats} aria-label="Collection statistics">
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Catalog</p>
            <h2 className={styles.sectionTitle}>Largest groups</h2>
          </div>
          <Link href="/agents" className={styles.sectionLink}>
            View all {meta.agents.total} agents →
          </Link>
        </div>
        <div className={styles.groupGrid}>
          {topGroups.map((group) => (
            <Link key={group.name} href={`/agents?group=${encodeURIComponent(group.name)}`} className={styles.groupCard}>
              <span className={styles.groupName}>{group.name}</span>
              <span className={styles.groupCount}>{group.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div>
          <p className={styles.kicker}>Workflow</p>
          <h2 className={styles.sectionTitle}>How it works</h2>
        </div>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.title} className={styles.step}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div>
          <p className={styles.kicker}>More</p>
          <h2 className={styles.sectionTitle}>Also in the collection</h2>
        </div>
        <div className={styles.cards}>
          {collectionCards.map((card) => (
            <Link key={card.href} href={card.href} className={styles.card}>
              <span className={styles.cardIcon}>{card.icon}</span>
              <span className={styles.cardTitle}>{card.title}</span>
              <span className={styles.cardBody}>{card.body}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaBg} aria-hidden="true" />
        <div className={styles.ctaCopy}>
          <p className={styles.kicker}>Start now</p>
          <h2 className={styles.ctaTitle}>One command between you and 205 agents.</h2>
          <p className={styles.ctaBody}>
            Works with OpenCode out of the box, and with Claude Code through the generated mirror.
          </p>
        </div>
        <div className={styles.ctaTerminal}>
          <TerminalWindow command={installCommand} title="install" />
        </div>
      </section>
    </div>
  );
}
