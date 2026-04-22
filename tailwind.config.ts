import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: { center: true, padding: "1.5rem" },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: [
          "var(--font-display)",
          "Iowan Old Style",
          "Georgia",
          "serif",
        ],
      },
      maxWidth: { content: "1240px" },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--secondary)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: "var(--destructive)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        cream: { DEFAULT: "#F5F0E6", 2: "#EEE7D8", 3: "#E6DDC9" },
        ink: { DEFAULT: "#0A0A0A", 2: "#1A1A1A", 3: "#3A3834" },
        line: { DEFAULT: "#D7CFBE", 2: "#C3B99F" },
        signal: { DEFAULT: "#DC2626", wash: "#F2D8D8", ink: "#8A1818" },
        panel: { DEFAULT: "#0E0E0E", 2: "#161513" },
        mute: "#6B6862",
        ok: "#2D6A4F",
      },
      borderRadius: { lg: "var(--radius)" },
      keyframes: {
        "pulse-signal": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.15" },
        },
        "arch-pulse": {
          "0%": { offsetDistance: "0%" },
          "100%": { offsetDistance: "100%" },
        },
      },
      animation: {
        "pulse-signal": "pulse-signal 1.6s ease-in-out infinite",
        "arch-pulse": "arch-pulse 6s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
