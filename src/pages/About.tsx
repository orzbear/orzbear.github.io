"use client";

const education = [
  { period: "2023–2025", title: "M.C.S., Computer Science", place: "University of Sydney" },
  { period: "2019–2021", title: "M.A., Political Science", place: "Georgetown University" },
  { period: "2013–2017", title: "B.A., Political Science", place: "National Chengchi University" },
];

const experience = [
  {
    period: "2024–Present",
    title: "Software Engineer",
    description:
      "Full-stack projects with React, Node.js, and Docker. Building intelligent systems and data-driven products that connect technology with real human needs.",
  },
  {
    period: "2024–Present",
    title: "Data Science & AI Research",
    description:
      "NLP, ML model development, and visualization. Applied research in retrieval-augmented generation, probabilistic forecasting, and computational social science.",
  },
  {
    period: "2024",
    title: "Volunteer Developer, Vets for Compassion",
    description:
      "Wildlife rescue application development and civic technology projects at the intersection of AI and public interest.",
  },
];

export default function About() {
  return (
    <div className="py-20 max-w-[760px] mx-auto">
      {/* Hero: image + intro */}
      <section className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14 mb-16">
        <div className="w-full lg:w-[40%] shrink-0">
          <img
            src="/images/profile.jpg"
            alt="Cho-Han Hsiung portrait"
            className="w-full object-cover"
            style={{ borderRadius: "3px" }}
          />
        </div>

        <div className="w-full lg:w-[60%]">
          <h1
            className="font-blanco text-charcoal font-normal"
            style={{ fontSize: "40px", lineHeight: 1.25 }}
          >
            About
          </h1>

          <p
            className="text-graphite mt-6"
            style={{ fontSize: "18px", lineHeight: 1.5, marginBottom: "27px" }}
          >
            I'm Cho-Han Hsiung — a software engineer with a background bridging
            computer science, AI, and political science. I enjoy creating
            intelligent systems and data-driven products that connect technology
            with real human needs.
          </p>

          <p
            className="text-graphite"
            style={{ fontSize: "18px", lineHeight: 1.5, marginBottom: "27px" }}
          >
            My work spans full-stack engineering, applied machine learning, and
            computational social science research. I'm drawn to problems where
            technical rigour meets public relevance.
          </p>
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2
          className="font-blanco text-charcoal font-normal"
          style={{ fontSize: "28px", lineHeight: 1.4, marginBottom: "40px" }}
        >
          Experience
        </h2>
        <div>
          {experience.map((e) => (
            <div
              key={e.title}
              className="flex gap-6 border-b border-ash"
              style={{ padding: "32px 0" }}
            >
              <span
                className="text-stone shrink-0"
                style={{ fontSize: "14px", width: "80px", paddingTop: "4px" }}
              >
                {e.period}
              </span>
              <div>
                <h3
                  className="font-blanco text-charcoal font-normal"
                  style={{ fontSize: "22px", lineHeight: 1.4 }}
                >
                  {e.title}
                </h3>
                <p
                  className="text-graphite mt-2 max-w-reading"
                  style={{ fontSize: "16px", lineHeight: 1.5 }}
                >
                  {e.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mt-16">
        <h2
          className="font-blanco text-charcoal font-normal"
          style={{ fontSize: "28px", lineHeight: 1.4, marginBottom: "40px" }}
        >
          Education
        </h2>
        <div>
          {education.map((e) => (
            <div
              key={e.title}
              className="flex gap-6 border-b border-ash"
              style={{ padding: "32px 0" }}
            >
              <span
                className="text-stone shrink-0"
                style={{ fontSize: "14px", width: "80px", paddingTop: "4px" }}
              >
                {e.period}
              </span>
              <div>
                <h3
                  className="font-blanco text-charcoal font-normal"
                  style={{ fontSize: "22px", lineHeight: 1.4 }}
                >
                  {e.title}
                </h3>
                <p
                  className="text-graphite mt-1"
                  style={{ fontSize: "16px", lineHeight: 1.5 }}
                >
                  {e.place}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
