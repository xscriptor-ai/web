"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AgentIndex, GroupInfo } from "@/lib/types";
import { colorToCss, formatTemperature } from "@/lib/data";
import styles from "./AgentCatalog.module.css";

type KindFilter = "all" | "specialized" | "senior";

export function AgentCatalog({ agents, groups }: { agents: AgentIndex[]; groups: GroupInfo[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [group, setGroup] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialGroup = params.get("group");
    const initialKind = params.get("kind");
    if (initialGroup) setGroup(initialGroup);
    if (initialKind === "senior" || initialKind === "specialized") setKind(initialKind);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && target === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((agent) => {
      if (kind !== "all" && agent.kind !== kind) return false;
      if (group !== "all" && agent.group !== group) return false;
      if (!q) return true;
      return (
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.group.toLowerCase().includes(q)
      );
    });
  }, [agents, query, kind, group]);

  const groupOptions = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups],
  );

  const hasFilters = query.trim() !== "" || kind !== "all" || group !== "all";

  function reset() {
    setQuery("");
    setKind("all");
    setGroup("all");
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            className={styles.search}
            placeholder="Search agents by name, group, or description"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search agents"
          />
          <kbd className={styles.kbd}>/</kbd>
        </div>

        <div className={styles.segmented} role="group" aria-label="Agent kind">
          {(["all", "specialized", "senior"] as KindFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              className={styles.segment}
              data-active={kind === value || undefined}
              onClick={() => setKind(value)}
            >
              {value === "all" ? "All" : value === "specialized" ? "Specialized" : "Senior"}
            </button>
          ))}
        </div>

        <select
          className={styles.select}
          value={group}
          onChange={(event) => setGroup(event.target.value)}
          aria-label="Filter by group"
        >
          <option value="all">All groups</option>
          {groupOptions.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name} ({item.count})
            </option>
          ))}
        </select>

        {hasFilters ? (
          <button type="button" className={styles.reset} onClick={reset}>
            Clear
          </button>
        ) : null}
      </div>

      <p className={styles.count} role="status">
        <span className={styles.countValue}>{filtered.length}</span> of {agents.length} agents
        {group !== "all" ? <span className={styles.countGroup}>· {group}</span> : null}
      </p>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No agents match those filters.</p>
          <button type="button" className={styles.emptyButton} onClick={reset}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((agent) => {
            const temperature = formatTemperature(agent.temperature);
            return (
              <Link key={agent.slug} href={`/agents/${agent.slug}`} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.dot} style={{ background: colorToCss(agent.color) }} aria-hidden="true" />
                  <span className={styles.cardName}>{agent.name}</span>
                  {agent.kind === "senior" ? <span className={styles.kindTag}>senior</span> : null}
                </div>
                <p className={styles.cardDescription}>{agent.description}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardGroup}>{agent.group}</span>
                  <span className={styles.cardFlags}>
                    {agent.readonly ? <span className={styles.readonly}>read-only</span> : null}
                    {temperature ? <span>temp {temperature}</span> : null}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
