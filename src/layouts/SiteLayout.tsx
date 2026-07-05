import { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { useApp } from "@/contexts/AppContext"

const navLinks = [
  { label: "Projects", to: "/projects" },
  { label: "Research", to: "/research" },
  { label: "Writing",  to: "/writing" },
  { label: "Journal",  to: "#" },
  { label: "About",    to: "/about" },
]

export default function SiteLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, lang, toggleTheme, toggleLang } = useApp()

  return (
    <div className="min-h-screen w-full bg-vellum text-ink-black font-degular">

      {/* ── Top-right controls — desktop only ── */}
      <div className="hidden lg:flex fixed top-0 right-0 items-center gap-3 px-6 py-5 z-50" style={{ fontSize: "13px" }}>
        <button
          onClick={toggleLang}
          className="bg-transparent border-0 cursor-pointer p-0 text-stone hover:text-ink-black"
          aria-label="Switch language"
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
        <span className="text-ash">|</span>
        <button
          onClick={toggleTheme}
          className="bg-transparent border-0 cursor-pointer p-0 text-stone hover:text-ink-black"
          aria-label="Toggle theme"
          style={{ fontSize: "15px", lineHeight: 1 }}
        >
          {theme === "light" ? "○" : "●"}
        </button>
      </div>

      {/* ── Mobile top bar ── */}
      <header className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 bg-vellum z-40 lg:hidden">
        <NavLink to="/" className="flex items-center gap-2 no-underline">
          <img src="/images/bear-logo.png" alt="" className="w-6 h-6 object-contain" />
          <span className="text-body font-medium text-ink-black whitespace-nowrap">Cho-Han Hsiung</span>
        </NavLink>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-transparent border-0 cursor-pointer text-ink-black p-1"
          aria-label="Toggle menu"
          style={{ fontSize: "24px" }}
        >
          {mobileOpen ? "×" : "≡"}
        </button>
      </header>

      {/* ── Mobile nav overlay ── */}
      {mobileOpen && (
        <nav className="fixed inset-0 top-14 bg-vellum z-30 flex flex-col gap-4 px-6 py-8 lg:hidden">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-body font-medium no-underline transition-colors duration-200 ${
                  isActive
                    ? "text-ink-black border-b border-ink-black pb-px"
                    : "text-stone hover:text-ink-black"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="mt-auto flex flex-col gap-4">
            <div className="flex items-center gap-4" style={{ fontSize: "14px" }}>
              <a href="https://linkedin.com/in/orzbear" target="_blank" rel="noreferrer" className="text-ink-black no-underline">
                LinkedIn <span style={{ fontSize: "75%" }}>&#8599;</span>
              </a>
              <a href="https://github.com/orzbear" target="_blank" rel="noreferrer" className="text-ink-black no-underline">
                GitHub <span style={{ fontSize: "75%" }}>&#8599;</span>
              </a>
            </div>
            <div className="flex items-center gap-3" style={{ fontSize: "14px" }}>
              <button
                onClick={toggleLang}
                className="bg-transparent border-0 cursor-pointer p-0 text-stone"
                aria-label="Switch language"
              >
                {lang === "en" ? "中文" : "EN"}
              </button>
              <span className="text-ash">|</span>
              <button
                onClick={toggleTheme}
                className="bg-transparent border-0 cursor-pointer p-0 text-stone"
                aria-label="Toggle theme"
              >
                {theme === "light" ? "○ Light" : "● Dark"}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[180px] flex-col justify-between p-8">
        <NavLink to="/" className="flex items-center gap-2 no-underline">
          <img src="/images/bear-logo.png" alt="" className="w-7 h-7 object-contain shrink-0" />
          <span className="text-body font-medium text-ink-black whitespace-nowrap">Cho-Han Hsiung</span>
        </NavLink>

        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-3">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `text-body font-medium no-underline transition-colors duration-200 ${
                    isActive
                      ? "text-ink-black border-b border-ink-black pb-px"
                      : "text-stone hover:text-ink-black"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3" style={{ fontSize: "14px" }}>
            <a href="https://linkedin.com/in/orzbear" target="_blank" rel="noreferrer" className="text-ink-black no-underline">
              LinkedIn
            </a>
            <span className="text-ash">|</span>
            <a href="https://github.com/orzbear" target="_blank" rel="noreferrer" className="text-ink-black no-underline">
              GitHub
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main content — no max-width; pages own their reading column ── */}
      <main className="pt-14 px-6 lg:pt-0 lg:ml-[180px]">
        <div className="w-full max-w-[1250px] py-16 px-6 lg:px-12 ml-0 lg:ml-[100px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
