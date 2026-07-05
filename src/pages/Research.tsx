"use client";
import { useMemo, useState } from "react";
import writingsRaw from "@/data/writings.json";
import type { Writing, WritingCategory } from "@/types/writing";
import { Link } from "react-router-dom";

type TabKey = "ai" | "political";

const TABS: Array<{ key: TabKey; label: string; cat: WritingCategory }> = [
  { key: "ai",        label: "Data Science & AI",  cat: "ai-data" },
  { key: "political", label: "Political Science",  cat: "political-science" },
];

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export default function Research() {
  const [tab, setTab] = useState<TabKey>("ai");

  const writings = useMemo(() => writingsRaw as Writing[], []);
  const byCat = useMemo(() => {
    const map: Record<WritingCategory, Writing[]> = {
      "ai-data": [],
      "political-science": [],
      "policy-writing": [], // kept in type, not surfaced here
    };
    writings
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((w) => map[w.category].push(w));
    return map;
  }, [writings]);

  const active = byCat[TABS.find((t) => t.key === tab)!.cat];

  return (
    <div className="py-20 max-w-[760px] mx-auto">
      <h1
        className="font-blanco text-charcoal"
        style={{ fontSize: "28px", lineHeight: 1.4, marginBottom: "40px" }}
      >
        Research
      </h1>

      {/* Tabs — plain inline text, no pills or boxes */}
      <div
        role="tablist"
        aria-label="Writing categories"
        className="flex gap-6"
        style={{ marginBottom: "32px" }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            aria-controls={`panel-${t.key}`}
            onClick={() => setTab(t.key)}
            className="bg-transparent border-0 cursor-pointer p-0"
            style={{
              fontSize: "16px",
              color:
                tab === t.key
                  ? "var(--color-ink-black)"
                  : "var(--color-stone)",
              fontWeight: tab === t.key ? 500 : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Article list — resumé-entry rows */}
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={tab}>
        {!active?.length ? (
          <p className="text-stone" style={{ fontSize: "16px" }}>
            No posts yet in this category.
          </p>
        ) : (
          <div>
            {active.map((w) => (
              <div
                key={w.id}
                className="flex gap-6 border-b border-ash"
                style={{ padding: "32px 0" }}
              >
                {/* Left column: date */}
                <div
                  className="shrink-0 text-stone"
                  style={{ width: "80px", fontSize: "14px", paddingTop: "4px" }}
                >
                  <time dateTime={w.date}>{formatDate(w.date)}</time>
                  {w.readTime && (
                    <span
                      className="block text-pebble"
                      style={{ fontSize: "13px", marginTop: "2px" }}
                    >
                      {w.readTime}
                    </span>
                  )}
                </div>

                {/* Right column: title, summary, tags, link */}
                <div>
                  <h3
                    className="font-blanco text-charcoal font-normal"
                    style={{ fontSize: "22px", lineHeight: 1.4 }}
                  >
                    {w.link ? (
                      <a
                        href={w.link}
                        className="text-charcoal no-underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {w.title}
                      </a>
                    ) : (
                      <Link
                        to={`/writings/${w.id}`}
                        className="text-charcoal no-underline"
                      >
                        {w.title}
                      </Link>
                    )}
                  </h3>

                  {w.summary && (
                    <p
                      className="text-graphite mt-2 max-w-reading"
                      style={{ fontSize: "16px", lineHeight: 1.5 }}
                    >
                      {w.summary}
                    </p>
                  )}

                  {!!w.tags?.length && (
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
                      {w.tags.map((t) => (
                        <span
                          key={t}
                          className="text-stone"
                          style={{ fontSize: "14px" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3" style={{ fontSize: "16px" }}>
                    {w.link ? (
                      <a
                        href={w.link}
                        className="text-ink-black no-underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read <span style={{ fontSize: "75%" }}>&#8599;</span>
                      </a>
                    ) : (
                      <Link
                        to={`/writings/${w.id}`}
                        className="text-ink-black no-underline"
                      >
                        Read <span style={{ fontSize: "75%" }}>&#8599;</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
