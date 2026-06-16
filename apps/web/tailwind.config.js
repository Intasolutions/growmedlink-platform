/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A192F", // Deep Navy Blue
          light: "#172A45",
          dark: "#020C1B",
          foreground: "#F8FAFC",
        },
        secondary: {
          DEFAULT: "#D97706", // Premium Gold / Amber 600
          dark: "#B45309",
          foreground: "#020C1B",
        },
        accent: {
          DEFAULT: "#3B82F6", // Indigo / Blue accents
          foreground: "#FFFFFF",
        },
        background: "#F8FAFC",
        card: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        heading: ["var(--font-heading)", "Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
