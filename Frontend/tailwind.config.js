/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#FFD166",
        "gray-light": "#D1D5DB",

        // Navy Shades
        "navy-midnight": "#0B1120",
        "navy-deep": "#121C2F",

        // Purple & Blue Accents
        purple: "#6B2EFF",
        "blue-electric": "#3A6FF7",

        // Golden text used in gradients
        yellow: {
          300: "#FFE28A"
        }
      },

      // Optional gradient background
      backgroundImage: {
        "knightly-gradient":
          "linear-gradient(135deg, #0B1120, #121C2F 40%, #1A2040 80%)",
        "button-gradient":
          "linear-gradient(135deg, #6B2EFF, #3A6FF7)",
      },
    },
  },
  plugins: [],
};
