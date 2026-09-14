"use client";

import { useState } from "react";
import styles from "./CopyButton.module.css";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button type="button" className={styles.button} onClick={copy} aria-live="polite">
      {copied ? "Copied" : label}
    </button>
  );
}
