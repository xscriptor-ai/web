import type { Metadata } from "next";
import Link from "next/link";
import { DocToc } from "@/components/DocToc";
import { TerminalWindow } from "@/components/TerminalWindow";
import { meta } from "@/lib/data";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Install Xscriptor agents, skills, and commands for OpenCode and Claude Code: npx, install script, clone, packages, and utilities.",
};

const sections = [
  { id: "quick-start", label: "Quick start" },
  { id: "script", label: "Install script" },
  { id: "installed", label: "What gets installed" },
  { id: "claude", label: "Claude Code" },
  { id: "packages", label: "Packages" },
  { id: "utilities", label: "Utilities" },
  { id: "updating", label: "Updating" },
];

const installSkills = meta.skills.project + meta.skills.senior;

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Get started</p>
        <h1 className={styles.title}>Installation</h1>
        <p className={styles.lead}>
          Everything installs as plain markdown into your OpenCode or Claude Code configuration. No
          runtime, no build step, no lock-in.
        </p>
      </header>

      <div className={styles.layout}>
        <DocToc sections={sections} />

        <div className={styles.content}>
          <section id="quick-start" className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick start</h2>
            <TerminalWindow
              command="npx @xscriptor/ai-agents"
              output={[
                `[OK] ${meta.agents.specialized} specialized · ${meta.agents.senior} senior agents`,
                `[OK] ${installSkills} skills · ${meta.commands} commands`,
                "[..] ~/.config/opencode/",
              ]}
            />
            <p className={styles.text}>
              Installs {meta.agents.total} agents, {installSkills} skills, and {meta.commands}{" "}
              commands into <code>~/.config/opencode/</code>. Target another platform or scope with
              the flags below.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Flag</th>
                    <th>Effect</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>--agents</code></td><td>Specialized agents only</td></tr>
                  <tr><td><code>--senior</code></td><td>Senior agents only</td></tr>
                  <tr><td><code>--skills</code></td><td>Project and senior skills only</td></tr>
                  <tr><td><code>--commands</code></td><td>Slash commands only</td></tr>
                  <tr><td><code>--groups LIST</code></td><td>Specific groups, e.g. <code>general,web/security</code></td></tr>
                  <tr><td><code>--anthropic</code></td><td>Install the Claude Code mirror into <code>~/.claude/</code></td></tr>
                  <tr><td><code>--project</code></td><td>Install into <code>.opencode/</code> in the current directory</td></tr>
                  <tr><td><code>--dry-run</code></td><td>Preview without copying</td></tr>
                  <tr><td><code>--list</code></td><td>List available groups and counts</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="script" className={styles.section}>
            <h2 className={styles.sectionTitle}>Install script</h2>
            <p className={styles.text}>
              The bash installer detects sibling checkouts of the agents and skills repos, or
              downloads them automatically. Requires <code>curl</code> and <code>tar</code> (or{" "}
              <code>git</code>).
            </p>
            <TerminalWindow command="curl -fsSL https://raw.githubusercontent.com/xscriptor-ai/scripts/main/install-agents.sh | bash" />
            <p className={styles.text}>Or from a local clone:</p>
            <TerminalWindow
              title="clone + install"
              command={
                "git clone https://github.com/xscriptor-ai/scripts.git\n" +
                "git clone https://github.com/xscriptor-ai/agents.git\n" +
                "git clone https://github.com/xscriptor-ai/skills.git\n" +
                "cd scripts && ./install-agents.sh"
              }
            />
            <p className={styles.text}>
              The script accepts the same selection flags as the npm package plus{" "}
              <code>--interactive</code> and <code>--global</code>. Environment overrides:{" "}
              <code>XSCRIPTOR_AGENTS_DIR</code>, <code>XSCRIPTOR_SKILLS_DIR</code>,{" "}
              <code>XSCRIPTOR_REF</code>.
            </p>
          </section>

          <section id="installed" className={styles.section}>
            <h2 className={styles.sectionTitle}>What gets installed</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Count</th>
                    <th>OpenCode destination</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Specialized agents</td><td>{meta.agents.specialized}</td><td><code>~/.config/opencode/agents/</code></td></tr>
                  <tr><td>Senior agents</td><td>{meta.agents.senior}</td><td><code>~/.config/opencode/agents/</code></td></tr>
                  <tr><td>Project skills</td><td>{meta.skills.project}</td><td><code>~/.config/opencode/skills/</code></td></tr>
                  <tr><td>Senior skills</td><td>{meta.skills.senior}</td><td><code>~/.config/opencode/skills/</code></td></tr>
                  <tr><td>Commands</td><td>{meta.commands}</td><td><code>~/.config/opencode/commands/</code></td></tr>
                </tbody>
              </table>
            </div>
            <p className={styles.text}>
              With <code>--project</code>, everything goes to <code>.opencode/</code> in the current
              directory instead, which keeps installs isolated per repository. The{" "}
              {meta.skills.content} content skill in the skills repo is catalogued on the site and
              installed by copying its folder.
            </p>
          </section>

          <section id="claude" className={styles.section}>
            <h2 className={styles.sectionTitle}>Claude Code</h2>
            <p className={styles.text}>
              Claude Code uses a different frontmatter schema, so the collection ships a generated
              mirror with translated agents and prefixed skills (<code>senior-python</code>).
              Slash commands keep their <code>x-</code> prefix on both platforms.
            </p>
            <TerminalWindow command="npx @xscriptor/ai-agents --anthropic" />
            <p className={styles.text}>
              This installs <code>~/.claude/agents/xscriptor/</code>,{" "}
              <code>~/.claude/skills/{"{name}"}</code>, and <code>~/.claude/commands/x-*.md</code>.
              To uninstall, remove <code>~/.claude/agents/xscriptor</code> and the skill folders you
              installed.
            </p>
          </section>

          <section id="packages" className={styles.section}>
            <h2 className={styles.sectionTitle}>Packages</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Command</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>@xscriptor/ai-agents</code></td><td><code>npx @xscriptor/ai-agents</code></td></tr>
                  <tr><td><code>@xscriptor/skill-xscriptor</code></td><td><code>npx @xscriptor/skill-xscriptor</code></td></tr>
                  <tr><td><code>@xscriptor/skill-devx</code></td><td><code>npx @xscriptor/skill-devx</code></td></tr>
                  <tr><td><code>@xscriptor/skill-samurai</code></td><td><code>npx @xscriptor/skill-samurai</code></td></tr>
                  <tr><td><code>@xscriptor/skill-xglassmorphism</code></td><td><code>npx @xscriptor/skill-xglassmorphism</code></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="utilities" className={styles.section}>
            <h2 className={styles.sectionTitle}>Utilities</h2>
            <p className={styles.text}>
              The scripts repo ships maintenance tools. They auto-detect a sibling agents checkout,
              or accept <code>--agents PATH</code>.
            </p>
            <ul className={styles.list}>
              <li><code>validate-agents.sh</code> — check frontmatter, fields, temperature, and permissions.</li>
              <li><code>check-permissions.sh</code> — audit permission risk across the collection.</li>
              <li><code>agent-stats.sh</code> / <code>agent-stats.py</code> — counts, temperature, color, and permission distribution.</li>
              <li><code>diff-agents.sh</code> — compare installed agents against the repo.</li>
              <li><code>build-docs.sh</code> — generate a combined reference document.</li>
              <li><code>generate-agent.sh</code> — interactive generator for new agents.</li>
              <li><code>backup-agents.sh</code> — timestamped backup of installed agents.</li>
            </ul>
          </section>

          <section id="updating" className={styles.section}>
            <h2 className={styles.sectionTitle}>Updating</h2>
            <p className={styles.text}>
              Re-run the installer to refresh an installation. For OpenCode, use{" "}
              <code>diff-agents.sh</code> to see what changed before overwriting, and scope installs
              with <code>--project</code> if you want per-repository control.
            </p>
            <p className={styles.text}>
              Sources: <Link href="/agents">agents</Link> and <Link href="/skills">skills</Link> are
              generated from the repositories, this site included. Last sync{" "}
              {new Date(meta.generatedAt).toISOString().slice(0, 10)}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
