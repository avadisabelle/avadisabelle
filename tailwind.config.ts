import type { Config } from "tailwindcss";

// The Sanctuaire palette flows through CSS custom properties (see app/globals.css),
// so a single token set drives both light and dark themes. Utilities reference the
// vars directly, e.g. `bg-shell`, `text-ink`, `border-line`, `text-purple`.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shell: "var(--shell)",
        panel: "var(--panel)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        purple: "var(--purple)",
        river: "var(--river)",
        ember: "var(--ember)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
    },
  },
  plugins: [],
};

export default config;
