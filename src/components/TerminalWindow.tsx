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
        <span className={styles.tag}>[ {title} ]</span>
        <CopyButton value={command} label={copyLabel} />
      </div>
      <pre className={styles.body}>
        <code>
          <span className={styles.line}>
            <span className={styles.prompt}>$</span>
            <span className={styles.command}>{command}</span>
          </span>
          {output.map((line) => {
            const match = line.match(/^(\[[^\]]+\])(.*)$/);
            if (!match) {
              return (
                <span key={line} className={styles.output}>
                  {line}
                </span>
              );
            }
            return (
              <span key={line} className={styles.output}>
                <span
                  className={match[1] === "[OK]" ? styles.statusOk : styles.status}
                >
                  {match[1]}
                </span>
                {match[2]}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
