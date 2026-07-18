/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        chalk: "#F7FAF8",
        slateboard: "#12343B",
        meadow: "#1E7F67",
        meadowHover: "#176B57",
        meadowActive: "#115344",
        coral: "#D95D4E",
        honey: "#F2B84B",
        info: "#4E6E81",
        warningText: "#7A4B04",
        skywash: "#EAF4F8",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(18, 52, 59, 0.10)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
