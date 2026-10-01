import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "powder-blue": "#D0E1F9",
        "powder-light": "#F0F5FD",
        "soft-blue": "#90AFC5",
        "deep-blue": "#3A5A78",
        ivory: "#FAF9F6",
        cream: "#FFFDF9",
        champagne: "#E6DACE",
        "gold-accent": "#C5A059",
        "gold-light": "#F4E8C1",
        "slate-soft": "#5A6B7C",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(74,122,150,.08)",
        soft: "0 10px 30px -5px rgba(0,0,0,.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;
