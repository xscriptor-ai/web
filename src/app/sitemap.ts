import type { MetadataRoute } from "next";
import { agents, skills } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${process.env.NEXT_PUBLIC_SITE_URL || "https://xscriptor-ai.github.io"}${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;
  const lastModified = new Date();

  const routes = ["", "agents", "skills", "commands", "docs"].map((route) => ({
    url: `${base}/${route}${route ? "/" : ""}`,
    lastModified,
  }));

  const agentPages = agents.map((agent) => ({
    url: `${base}/agents/${agent.slug}/`,
    lastModified,
  }));

  const skillPages = skills.map((skill) => ({
    url: `${base}/skills/${skill.name}/`,
    lastModified,
  }));

  return [...routes, ...agentPages, ...skillPages];
}
