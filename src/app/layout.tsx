import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import styles from "./layout.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xscriptor-ai.github.io";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}${basePath}`),
  title: {
    default: "xscriptor-ai — Agents and Skills for OpenCode and Claude Code",
    template: "%s · xscriptor-ai",
  },
  description:
    "Ready-to-use AI agents, skills, and slash commands for OpenCode and Claude Code. Browse 181 specialized agents, 24 senior agents, 21 skills, and 8 commands.",
  openGraph: {
    type: "website",
    siteName: "xscriptor-ai",
    title: "xscriptor-ai — Agents and Skills for OpenCode and Claude Code",
    description:
      "Ready-to-use AI agents, skills, and slash commands for OpenCode and Claude Code.",
  },
  other: { "color-scheme": "dark light" },
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a className={styles.skip} href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main" className={styles.main}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
