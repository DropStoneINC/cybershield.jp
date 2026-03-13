import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jcs: {
          navy: "#0a1628",
          blue: "#1e3a5f",
          accent: "#00d4ff",
          green: "#00ff88",
          red: "#ff4444",
          orange: "#ff8800",
          dark: "#0d1117",
          card: "#161b22",
          border: "#30363d",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
