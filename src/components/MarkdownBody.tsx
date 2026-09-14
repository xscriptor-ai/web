import styles from "./MarkdownBody.module.css";

export function MarkdownBody({ html }: { html: string }) {
  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />;
}
