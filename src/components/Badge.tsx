import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type Tone = "default" | "primary" | "muted";

export function Badge({
  children,
  tone = "default",
  dotColor,
}: {
  children: ReactNode;
  tone?: Tone;
  dotColor?: string | null;
}) {
  return (
    <span className={styles.badge} data-tone={tone}>
      {dotColor ? <span className={styles.dot} style={{ background: dotColor }} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
