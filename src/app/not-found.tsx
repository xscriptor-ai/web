import Link from "next/link";
import styles from "./not-found.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <img className={styles.logo} src={`${basePath}/logo-glyph.svg`} alt="" width={56} height={56} />
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>This page does not exist.</h1>
      <p className={styles.body}>It may have been moved, or the agent you are looking for is gone.</p>
      <div className={styles.actions}>
        <Link href="/agents" className={styles.primary}>
          Browse agents
        </Link>
        <Link href="/" className={styles.secondary}>
          Back home
        </Link>
      </div>
    </div>
  );
}
