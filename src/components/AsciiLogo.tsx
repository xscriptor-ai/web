import { readFileSync } from "node:fs";
import { join } from "node:path";
import styles from "./AsciiLogo.module.css";

const asciiMark = readFileSync(
  join(process.cwd(), "public/logos/equisdots-ascii-shadow.txt"),
  "utf8",
).trimEnd();

export function AsciiLogo() {
  return (
    <pre aria-hidden="true" className={styles.mark}>
      {asciiMark}
    </pre>
  );
}
