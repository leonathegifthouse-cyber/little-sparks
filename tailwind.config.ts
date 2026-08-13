import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFCF5",
        ink: "#241C4A",
        coral: {
          DEFAULT: "#FF5C5C",
          dark: "#E63E3E",
        },
        turquoise: {
          DEFAULT: "#00CFC1",
          dark: "#00A79C",
        },
        sunshine: {
          DEFAULT: "#FFD23F",
          dark: "#F5B700",
        },
        bubblegum: "#FF5FA2",
        grape: "#8E5CFF",
        lime: "#9CE01F",
        sky: "#3FC6FF",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
        body: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "42% 58% 65% 35% / 45% 45% 55% 55%",
      },
    },
  },
  plugins: [],
};

export default config;
