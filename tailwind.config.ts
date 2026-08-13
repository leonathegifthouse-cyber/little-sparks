import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFBF2",
        ink: "#2B2250",
        coral: {
          DEFAULT: "#FF6B4A",
          dark: "#E85535",
        },
        turquoise: {
          DEFAULT: "#2EC4B6",
          dark: "#22A093",
        },
        sunshine: {
          DEFAULT: "#FFC857",
          dark: "#F0AE29",
        },
        bubblegum: "#FF6B9D",
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
