"use client";
import raw from "@/data/projects.json";
import type { Project } from "@/types/project";
import { useMemo } from "react";
import ProjectPreview from "@/components/ProjectPreview";

export default function Projects() {
  const projects = useMemo(
    () => (raw as Project[]).slice().sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
    [],
  );

  return (
    <div className="py-20 max-w-[760px] mx-auto">
      <h1
        className="font-blanco text-charcoal"
        style={{ fontSize: "28px", lineHeight: 1.4, marginBottom: "40px" }}
      >
        Projects
      </h1>

      <div>
        {projects.map((p) => {
          const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];

          return (
            <div
              key={p.slug}
              className="border-b border-ash"
              style={{ padding: "40px 0" }}
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left: image or placeholder */}
                <div className="w-full lg:w-[42%] flex-shrink-0">
                  {imgs.length > 0 ? (
                    <ProjectPreview images={imgs} title={p.title} />
                  ) : (
                    <div
                      className="w-full flex items-center justify-center text-stone font-degular"
                      style={{
                        aspectRatio: "16/10",
                        borderRadius: "3px",
                        border: "1px solid var(--color-ash)",
                        fontSize: "13px",
                      }}
                    >
                      {p.title}
                    </div>
                  )}
                </div>

                {/* Right: details */}
                <div className="w-full lg:w-[58%]">
                  {/* Year */}
                  <span
                    className="text-stone"
                    style={{ fontSize: "13px" }}
                  >
                    {p.year} · {p.type}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-blanco text-charcoal font-normal"
                    style={{ fontSize: "22px", lineHeight: 1.4, marginTop: "4px" }}
                  >
                    {p.title}
                  </h3>

                  {/* Tech stack pills */}
                  {!!p.stack?.length && (
                    <div style={{ marginTop: "12px" }}>
                      <span
                        className="text-stone"
                        style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}
                      >
                        Tech Stack
                      </span>
                      <div className="flex flex-wrap gap-2" style={{ marginTop: "6px" }}>
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: "12px",
                              background: "var(--color-pill-bg)",
                              color: "var(--color-ink-black)",
                              padding: "3px 9px",
                              borderRadius: "3px",
                              border: "1px solid var(--color-ash)",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {p.summary && (
                    <p
                      className="text-graphite"
                      style={{ fontSize: "15px", lineHeight: 1.6, marginTop: "14px" }}
                    >
                      {p.summary}
                    </p>
                  )}

                  {/* Links */}
                  <div
                    className="flex items-center gap-4 text-ink-black"
                    style={{ fontSize: "15px", marginTop: "14px" }}
                  >
                    {p.links?.demo && p.links.demo !== "#" && (
                      <a href={p.links.demo} target="_blank" rel="noreferrer" className="no-underline text-ink-black">
                        Demo <span style={{ fontSize: "75%" }}>&#8599;</span>
                      </a>
                    )}
                    {p.links?.github && p.links.github !== "#" && (
                      <a href={p.links.github} target="_blank" rel="noreferrer" className="no-underline text-ink-black">
                        GitHub <span style={{ fontSize: "75%" }}>&#8599;</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
