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
          DEFAULT: "#96CA45", // Public site brand green
          dark: "#7AAE2F",
          foreground: "#020C1B",
        },
        accent: {
          DEFAULT: "#155BA9", // Public site brand blue
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
