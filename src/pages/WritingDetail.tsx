"use client";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useMemo, useState } from "react";
import writingsRaw from "@/data/writings.json";
import type { Writing } from "@/types/writing";

const modules = import.meta.glob("/content/writings/*.md", { as: "raw" });

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function WritingDetail() {
  const { id } = useParams();
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const writings = useMemo(() => writingsRaw as Writing[], []);
  const meta = useMemo(
    () => writings.find((w) => w.id === id),
    [writings, id],
  );

  useEffect(() => {
    if (!id) return;
    const key = `/content/writings/${id}.md`;
    const loader = modules[key];
    if (!loader) {
      setError("This article was not found.");
      return;
    }
    (async () => {
      try {
        const raw = await loader();
        setContent(raw);
      } catch {
        setError("Failed to load this article.");
      }
    })();
  }, [id]);

  if (error) return <p className="text-stone">{error}</p>;
  if (!content) return <p className="text-stone">Loading…</p>;

  return (
    <div className="py-20 max-w-[720px] mx-auto">
      {/* Back link */}
      <Link
        to="/writing"
        className="text-stone hover:text-charcoal"
        style={{ fontSize: "14px" }}
      >
        ← Back to Writing
      </Link>

      {/* Article header */}
      <header className="mt-8 mb-8">
        {(meta?.publication || meta?.lang) && (
          <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
            {meta?.publication && (
              <span
                className="text-stone"
                style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {meta.publication}
              </span>
            )}
            {meta?.lang === "zh" && (
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
        <h1
          className="font-blanco text-charcoal font-normal"
          style={{ fontSize: "40px", lineHeight: 1.25 }}
        >
          {meta?.title || id}
        </h1>
        {meta?.date && (
          <time
            dateTime={meta.date}
            className="block text-stone mt-3"
            style={{ fontSize: "14px" }}
          >
            {formatDate(meta.date)}
          </time>
        )}
        <div
          className="mt-6"
          style={{ borderBottom: "1px solid var(--color-ash)" }}
        />
      </header>

      {/* Markdown body */}
      <article
        className={[
          "prose max-w-none",
          // Paragraphs
          "prose-p:font-degular prose-p:text-[18px] prose-p:leading-[1.5] prose-p:text-graphite prose-p:mb-[27px]",
          // Headings
          "prose-headings:font-blanco prose-headings:text-charcoal prose-headings:font-normal",
          // Links
          "prose-a:text-ink-black prose-a:no-underline prose-a:border-b prose-a:border-ash prose-a:hover:opacity-80",
          // Blockquotes
          "prose-blockquote:border-l prose-blockquote:border-ash prose-blockquote:not-italic prose-blockquote:pl-6 prose-blockquote:text-pebble prose-blockquote:font-normal",
          // Lists
          "prose-li:font-degular prose-li:text-graphite prose-li:text-[16px] prose-li:leading-[1.5] prose-li:marker:text-ash",
          // Code blocks — no dark backgrounds
          "prose-pre:bg-transparent prose-pre:border prose-pre:border-ash prose-pre:rounded-sm prose-pre:text-[14px] prose-pre:text-graphite",
          "prose-code:bg-transparent prose-code:text-graphite prose-code:text-[14px] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
          // Images
          "prose-img:rounded-sm",
          // Strong / em
          "prose-strong:text-charcoal prose-strong:font-normal",
          "prose-em:text-graphite",
          // HR
          "prose-hr:border-ash",
        ].join(" ")}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
