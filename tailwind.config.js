/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        degular: ["'DM Sans'", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        blanco: ["'Source Serif 4'", "ui-serif", "Georgia", "'Times New Roman'", "serif"],
      },
      // Colors reference CSS variables so dark mode token swaps propagate automatically
      colors: {
        vellum:       "var(--color-vellum)",
        "ink-black":  "var(--color-ink-black)",
        graphite:     "var(--color-graphite)",
        charcoal:     "var(--color-charcoal)",
        stone:        "var(--color-stone)",
        pebble:       "var(--color-pebble)",
        ash:          "var(--color-ash)",
        slate:        "var(--color-slate)",
        "pressed-ink":"var(--color-pressed-ink)",
        midnight:     "var(--color-midnight)",
      },
      fontSize: {
        caption:      ["14px", { lineHeight: "1.5", letterSpacing: "0.1px" }],
        body:         ["16px", { lineHeight: "1.5" }],
        "body-lg":    ["18px", { lineHeight: "1.5" }],
        subheading:   ["20px", { lineHeight: "1.4" }],
        "heading-sm": ["22px", { lineHeight: "1.4" }],
        heading:      ["28px", { lineHeight: "1.4" }],
        "heading-lg": ["32px", { lineHeight: "1.25", letterSpacing: "0.025px" }],
        display:      ["40px", { lineHeight: "1.25", letterSpacing: "0.025px" }],
      },
      borderRadius: {
        sm:      "3px",
        DEFAULT: "3px",
        lg:      "8px",
      },
      maxWidth: {
        reading: "720px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
