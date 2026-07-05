import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useApp } from "@/contexts/AppContext";
import ScrollReveal from "@/components/ScrollReveal";
import ProjectPreview from "@/components/ProjectPreview";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Project = {
  title: string;
  slug: string;
  summary?: string;
  year?: number;
  type?: string;
  stack?: string[];
  featured?: boolean;
  featuredRank?: number;
  image?: string;
  images?: string[];
  links?: { demo?: string; github?: string };
};

// ── i18n strings ────────────────────────────────────────────────────────────
const t = {
  en: {
    role:       "Software Engineer; Policy Analyst",
    objective:  "I engineer robust, full-stack digital applications with a deep specialization in applied artificial intelligence. I leverage this technical foundation to analyze global systems as a policy analyst.",
    bio1:       "I am a software engineer focused on architecting scalable digital infrastructure, specializing in full-stack development (React, Node.js, Python, TypeScript, AWS) and the integration of AI systems like RAG pipelines and agentic workflows. ",
    bio2:       (<>Bridging this technical expertise with political research, I also explores and analyze Asian security, geopolitics, and technology policy, with my work published in the <i>East Asia Forum</i>, <i>Democracy & Society</i>, <i>International Policy Digest</i>, and <i>Up Media</i>.</>),
    email:      "Email me",
    resume:     "Featured Experience",
    work:       "Selected Projects",
    exp: [
      {
        period: "Apr 2026–Present",
        title:  "Software Engineer",
        company: "Australia Career Forum · Sydney (Remote)",
        link:   "https://australiacareerforum.com/",
        stack:  ["React.js", "GraphQL", "TypeScript", "AWS Lambda", "Stripe"],
        desc:   "Developed a web app with annual membership system via Stripe, supporting **20+ events and thousands of members**. Introduced **GraphQL Code Generator** for type-safe API automation. Built a Slack-integrated **AWS Lambda** tool enabling non-engineers to manage EC2 servers and **reducing idle-usage costs**.",
      },
      {
        period: "May 2026–Present",
        title:  "Non-Resident Fellow",
        company: "Dialogue China · Remote",
        link:   "https://www.dialoguechina.com/en/home-2/",
        desc:   "Researching **Indo-Pacific security and defense technology policy** across Australia, the U.S., Taiwan, and China. Assessing emerging technology integration in regional defense strategies and cross-strait security frameworks. Supporting **Washington D.C. policy and think tank networks** through political-military intelligence monitoring.",
      },
      {
        period: "Jun 2025–Apr 2026",
        title:  "Senior Full-Stack Developer",
        company: "TalentHub.Show · Sydney (Promoted from Intern, Jun–Sep 2025)",
        link:   "https://talenthub.show/",
        stack:  ["React", "Node.js", "TypeScript", "Firebase", "OpenAI"],
        desc:   "Built an AI-powered talent discovery platform. Integrated **OpenAI** to auto-generate candidate summaries, knowledge graphs, and semantic tags from video transcripts. Engineered **15+ reusable components** accelerating UI delivery by **30%**. Implemented **vector search** reducing query latency by **40%**.",
      },
      {
        period: "Jan 2022–Jan 2024",
        title:  "Software Engineer",
        company: "Plantsist Technology Co., Ltd.",
        link:   "https://apps.apple.com/au/app/nuknuk/id6472608387",
        stack:  ["React.js", "Java Spring Boot", "AWS", "Docker", "REST API", "CI/CD"],
        desc:   "Designed responsive **React dashboards** and data visualisation interfaces. Built **Java Spring Boot** RESTful APIs for real-time data tracking. Deployed on **AWS (EC2, S3)** with Docker and **CI/CD pipelines**, reducing deployment errors. Optimised performance cutting **page load time by 35%** and boosting **engagement by 20%**.",
      },
    ],
  },
  zh: {
    role:       "軟體工程師；政策分析師",
    objective:  "構建工程、人工智能與公共政策的交匯點。",
    bio1:       "我是一名軟體工程師，深入研究資料科學、人工智能與政策分析。本網站匯集了我的全端工程項目、應用AI實驗與政策研究。",
    bio2:       (<>作為政策分析師，我的研究聚焦亞洲安全、地緣政治與科技政策。評論刊載於<i>中央通訊社</i>、<i>今日新聞</i>及<i>美國之音</i>，學術成果發表於<i>東亞論壇</i>、<i>民主與社會</i>、<i>國際政策文摘</i>及<i>上報</i>。</>),
    email:      "電郵聯絡",
    resume:     "精選經歷",
    work:       "精選作品",
    exp: [
      {
        period: "2026年4月–至今",
        title:  "軟體工程師",
        company: "澳洲職業論壇 · 雪梨（遠端）",
        link:   "https://australiacareerforum.com/",
        stack:  ["React.js", "GraphQL", "TypeScript", "AWS Lambda", "Stripe"],
        desc:   "開發含 Stripe 金流的年費會員制網站，支援**20餘場活動與數千名會員**。引入 **GraphQL Code Generator** 實現型別安全的 API 自動整合。建構 Slack 整合的 **AWS Lambda** 伺服器管理工具，**降低閒置用量成本**。",
      },
      {
        period: "2026年5月–至今",
        title:  "非常駐研究員",
        company: "對話中國 · 遠端",
        link:   "https://www.dialoguechina.com/en/home-2/",
        desc:   "研究澳洲、美國、台灣與中國的**印太安全及國防科技政策**。評估新興技術於區域防衛戰略整合。支援**華盛頓特區政策與智庫網絡**之政治軍事動態監測。",
      },
      {
        period: "2025年6月–2026年4月",
        title:  "高級全端工程師",
        company: "TalentHub.Show · 雪梨（由實習晉升）",
        link:   "https://talenthub.show/",
        stack:  ["React", "Node.js", "TypeScript", "Firebase", "OpenAI"],
        desc:   "建構 AI 人才探索平台，整合 **OpenAI** 自動生成候選人摘要與知識圖譜。打造**15個以上可重用元件**，UI 交付效率提升 **30%**。建置**語意向量搜尋**，查詢延遲降低 **40%**。",
      },
      {
        period: "2022年1月–2024年1月",
        title:  "軟體工程師",
        company: "Plantsist Technology Co., Ltd.",
        link:   "https://apps.apple.com/au/app/nuknuk/id6472608387",
        stack:  ["React.js", "Java Spring Boot", "AWS", "Docker", "REST API", "CI/CD"],
        desc:   "設計響應式 **React 儀表板**與資料視覺化介面。開發 **Java Spring Boot** RESTful API。部署於 **AWS (EC2, S3)**，以 **Docker 與 CI/CD** 流水線降低部署錯誤，頁面載入時間縮短 **35%**，用戶參與度提升 **20%**。",
      },
    ],
  },
};

export default function Home() {
  const { lang } = useApp();
  const tx = t[lang];

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  useEffect(() => {
    import("../data/projects.json").then((m) => setAllProjects(m.default as Project[]));
  }, []);

  // Hero entrance — plays once on mount, not scroll-based
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(
        "[data-hero-img]",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.2, ease: "power3.out" },
      ).fromTo(
        "[data-hero-text]",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" },
        "-=0.5",
      );
    });
    return () => ctx.revert();
  }, []);

  const featured = useMemo(
    () =>
      allProjects
        .filter((p) => p.featured)
        .sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
    [allProjects],
  );

  // After featured projects render they add ~600px to the page — refresh all
  // ScrollTrigger instances so their positions are recalculated correctly.
  useEffect(() => {
    if (featured.length > 0) {
      ScrollTrigger.refresh();
    }
  }, [featured]);


  return (
    <div className="py-20 pb-64">

      {/* ── Hero ── */}
      <section className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">

        {/* Left: Image Collage — taller, bigger */}
        <div className="relative w-full lg:w-[44%] flex-shrink-0 lg:-ml-6" style={{ height: "480px" }}>
          <img
            data-hero-img
            src="/images/bear-logo.png"
            alt=""
            className="absolute object-contain bg-vellum"
            style={{
              top: 0, left: 0,
              width: "76%", height: "84%",
              borderRadius: "3px",
            }}
          />
          <img
            data-hero-img
            src="/images/profile.jpg"
            alt="Cho-Han Hsiung"
            className="absolute object-cover"
            style={{
              bottom: 0, right: 0,
              width: "42%", height: "42%",
              borderRadius: "3px",
            }}
          />
        </div>

        {/* Right: Three-tier prose */}
        <div className="flex flex-col justify-start w-full lg:w-[56%]">

          {/* Tier 1 — largest: role title */}
          <h1
            data-hero-text
            className="font-blanco text-charcoal font-normal"
            style={{ fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: 1.2 }}
          >
            {tx.role}
          </h1>

          {/* Tier 2 — medium: brief objective (above fold — no scroll reveal) */}
          <p
            data-hero-text
            className="font-blanco text-charcoal font-normal"
            style={{ fontSize: "20px", lineHeight: 1.4, marginTop: "20px" }}
          >
            {tx.objective}
          </p>

          {/* Tier 3 — smallest: detailed bio, sans */}
          <p
            data-hero-text
            className="text-graphite"
            style={{ fontSize: "16px", lineHeight: 1.6, marginTop: "24px", marginBottom: "16px" }}
          >
            {tx.bio1}
          </p>
          <p
            data-hero-text
            className="text-graphite"
            style={{ fontSize: "16px", lineHeight: 1.6, marginBottom: "28px" }}
          >
            {tx.bio2}
          </p>

          {/* CTA row */}
          <div data-hero-text className="flex items-center gap-4 flex-wrap">
            <a
              href="mailto:joe941230@gmail.com"
              className="inline-block font-medium transition-opacity duration-150 hover:opacity-80"
              style={{
                backgroundColor: "var(--color-button-bg)",
                color: "var(--color-button-text)",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "3px",
              }}
            >
              {tx.email}
            </a>
            <span className="text-ash" aria-hidden>|</span>
            <a
              href="https://linkedin.com/in/orzbear"
              target="_blank"
              rel="noreferrer"
              className="text-ink-black no-underline flex items-center gap-1 transition-opacity duration-150 hover:opacity-60"
              style={{ fontSize: "14px" }}
            >
              <FaLinkedin style={{ fontSize: "16px" }} />
              LinkedIn
            </a>
            <a
              href="https://github.com/orzbear"
              target="_blank"
              rel="noreferrer"
              className="text-ink-black no-underline flex items-center gap-1 transition-opacity duration-150 hover:opacity-60"
              style={{ fontSize: "14px" }}
            >
              <FaGithub style={{ fontSize: "16px" }} />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Resumé ── */}
      <section style={{ marginTop: "128px" }}>
        <ScrollReveal
          baseOpacity={0}
          enableBlur={false}
          baseRotation={2}
          containerClassName="font-blanco text-charcoal font-normal"
          style={{ fontSize: "28px", lineHeight: 1.4, marginBottom: "48px" }}
        >
          {tx.resume}
        </ScrollReveal>

        <div>
          {tx.exp.map((e) => (
            <div
              key={e.title}
              className="flex gap-6 border-b border-ash"
              style={{ paddingBottom: "32px", marginBottom: "32px" }}
            >
              <span
                className="text-stone shrink-0"
                style={{ fontSize: "14px", width: "120px", paddingTop: "4px" }}
              >
                {e.period}
              </span>
              <div>
                {/* Title + linked company in one heading */}
                <h3
                  className="font-blanco text-charcoal font-normal"
                  style={{ fontSize: "22px", lineHeight: 1.4 }}
                >
                  {e.title}
                  {e.company && (
                    <>
                      {" "}
                      <span
                        className="font-degular text-graphite"
                        style={{ fontSize: "15px", fontWeight: 400 }}
                      >
                        at{" "}
                        {e.link ? (
                          <a
                            href={e.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-charcoal no-underline border-b border-charcoal pb-px transition-opacity duration-150 hover:opacity-60"
                            style={{ fontWeight: 500 }}
                          >
                            {e.company.split(" · ")[0]}
                          </a>
                        ) : (
                          <span className="text-charcoal" style={{ fontWeight: 500 }}>
                            {e.company.split(" · ")[0]}
                          </span>
                        )}
                      </span>
                    </>
                  )}
                </h3>

                {/* Location / detail line */}
                {(() => {
                  const detail = e.company.split(" · ").slice(1).join(" · ");
                  return detail ? (
                    <p className="text-stone" style={{ fontSize: "13px", marginTop: "4px" }}>
                      {detail}
                    </p>
                  ) : null;
                })()}

                <ScrollReveal
                  as="p"
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={1}
                  blurStrength={3}
                  containerClassName="text-graphite"
                  style={{ fontSize: "16px", lineHeight: 1.5, marginTop: "10px" }}
                >
                  {e.desc}
                </ScrollReveal>

                {/* Tech stack pills */}
                {!!e.stack?.length && (
                  <div style={{ marginTop: "14px" }}>
                    <span
                      className="text-stone"
                      style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}
                    >
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-2" style={{ marginTop: "6px" }}>
                      {e.stack.map((s) => (
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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Selected Work ── */}
      <section style={{ marginTop: "128px" }}>
        <ScrollReveal
          baseOpacity={0}
          enableBlur={false}
          baseRotation={2}
          containerClassName="font-blanco text-charcoal font-normal"
          style={{ fontSize: "28px", lineHeight: 1.4, marginBottom: "48px" }}
        >
          {tx.work}
        </ScrollReveal>

        {featured.map((p, i) => (
          <article key={p.slug} style={{ marginTop: i === 0 ? 0 : "96px" }}>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

              {/* Left: project preview — carousel if multiple images, static if one */}
              <div className="w-full lg:w-[42%] flex-shrink-0">
                {(() => {
                  const imgs = p.images?.length
                    ? p.images
                    : p.image
                    ? [p.image]
                    : [];
                  return imgs.length > 0 ? (
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
                  );
                })()}
              </div>

              {/* Right: project details */}
              <div className="w-full lg:w-[58%]">
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={false}
                  baseRotation={2}
                  containerClassName="font-blanco text-charcoal font-normal"
                  style={{ fontSize: "28px", lineHeight: 1.25 }}
                >
                  {p.title}
                </ScrollReveal>

                <p className="text-stone" style={{ fontSize: "14px", marginTop: "4px" }}>
                  {p.type} · {p.year}
                </p>

                {/* Tech stack pills — above description */}
                {!!p.stack?.length && (
                  <div style={{ marginTop: "14px" }}>
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
                  <ScrollReveal
                    as="p"
                    baseOpacity={0}
                    enableBlur={true}
                    baseRotation={1}
                    blurStrength={3}
                    containerClassName="text-graphite"
                    style={{ fontSize: "16px", lineHeight: 1.6, marginTop: "16px" }}
                  >
                    {p.summary}
                  </ScrollReveal>
                )}

                {/* Links */}
                <div className="flex items-center gap-4 text-ink-black" style={{ fontSize: "15px", marginTop: "16px" }}>
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
          </article>
        ))}
      </section>
    </div>
  );
}
