/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#FFD166",
        "gray-light": "#C9CAD9",
        navy: {
                    deep: '#0A0F2C',
                    midnight: '#11193F',
                  },
                  gold: '#FFD166',
                  purple: '#6B2EFF',
                  blue: {
                    electric: '#3A6FF7',
                  },
                  gray: {
                    light: '#C9CAD9',
                  },

        // Final Knightly Colors
        "navy-dark": "#0A0F2C",      // background main
        "navy-card": "#11193F",      // card section
        "purple-accent": "#6B2EFF",
        "blue-electric": "#3A6FF7",

        "navy-midnight": "#0B1120",
        "navy-deep": "#121C2F",

        yellow: { 300: "#FFE28A" },
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
      },
      backgroundImage: {
        'knightly-gradient': 'linear-gradient(135deg, #0A0F2C 0%, #1B1452 100%)',
        'button-gradient': 'linear-gradient(90deg, #3A6FF7 0%, #6B2EFF 100%)',
      }
    },
  },
  plugins: [],
};

