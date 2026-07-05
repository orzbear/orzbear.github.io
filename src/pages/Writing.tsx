"use client";
import { useMemo } from "react";
import writingsRaw from "@/data/writings.json";
import type { Writing } from "@/types/writing";
import { Link } from "react-router-dom";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

export default function Writing() {
  const writings = useMemo(
    () =>
      (writingsRaw as Writing[])
        .filter((w) => w.category === "policy-writing")
        .sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );

  return (
    <div className="py-20 max-w-[760px] mx-auto">
      <h1
        className="font-blanco text-charcoal font-normal"
        style={{ fontSize: "28px", lineHeight: 1.4, marginBottom: "40px" }}
      >
        Writing
      </h1>

      <div>
        {!writings.length ? (
          <p className="text-stone" style={{ fontSize: "16px" }}>
            No posts yet.
          </p>
        ) : (
          writings.map((w) => {
            const isExternal = !!w.link && w.link !== "#";
            const TitleEl = isExternal ? (
              <a
                href={w.link}
                target="_blank"
                rel="noreferrer"
                className="text-charcoal no-underline hover:opacity-70 transition-opacity duration-150"
              >
                {w.title}{" "}
                <span style={{ fontSize: "70%", verticalAlign: "super" }}>&#8599;</span>
              </a>
            ) : (
              <Link
                to={`/writings/${w.id}`}
                className="text-charcoal no-underline hover:opacity-70 transition-opacity duration-150"
              >
                {w.title}
              </Link>
            );

            return (
              <div
                key={w.id}
                className="flex gap-6 border-b border-ash"
                style={{ padding: "32px 0" }}
              >
                {/* Left column: date + read time */}
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

                {/* Right column */}
                <div>
                  {/* Publication label + language badge */}
                  {(w.publication || w.lang) && (
                    <div
                      className="flex items-center gap-2"
                      style={{ marginBottom: "5px" }}
                    >
                      {w.publication && (
                        <span
                          className="text-stone"
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {w.publication}
                        </span>
                      )}
                      {w.lang === "zh" && (
                        <span
                          className="text-pebble"
                          style={{
                            fontSize: "11px",
                            border: "1px solid var(--color-ash)",
                            borderRadius: "3px",
                            padding: "1px 5px",
                          }}
                        >
                          中文
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title — links externally if published, internally otherwise */}
                  <h3
                    className="font-blanco font-normal"
                    style={{ fontSize: "22px", lineHeight: 1.4 }}
                  >
                    {TitleEl}
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
                        <span key={t} className="text-stone" style={{ fontSize: "13px" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3" style={{ fontSize: "15px" }}>
                    <Link to={`/writings/${w.id}`} className="text-ink-black no-underline">
                      Read <span style={{ fontSize: "75%" }}>&#8599;</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
