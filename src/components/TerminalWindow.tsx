import { CopyButton } from "./CopyButton";
import styles from "./TerminalWindow.module.css";

export function TerminalWindow({
  command,
  output = [],
  title = "zsh",
  copyLabel = "Copy",
}: {
  command: string;
  output?: string[];
  title?: string;
  copyLabel?: string;
}) {
  return (
    <div className={styles.window}>
      <div className={styles.bar}>
        <span className={styles.lights} aria-hidden="true">
          <i data-light="close" />
          <i data-light="min" />
          <i data-light="max" />
        </span>
        <span className={styles.title}>{title}</span>
        <CopyButton value={command} label={copyLabel} />
      </div>
      <pre className={styles.body}>
        <code>
          <span className={styles.line}>
            <span className={styles.prompt}>$ </span>
            <span className={styles.command}>{command}</span>
          </span>
          {output.map((line) => (
            <span key={line} className={styles.output}>
              {line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
