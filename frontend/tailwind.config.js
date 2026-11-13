/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "parchment-base": "#FBF9F5",
        "parchment-surface": "#F5F0E6",
        "parchment-card": "#FAF7F2",
        "marble-border": "#E2DAC8",
        "sepia-ink": "#1F1C18",
        "sepia-heading": "#2E2823",
        "warm-charcoal": "#5C554E",
        "gold-burnished": "#B8860B",
        "gold-accent": "#C59B27",
        "gold-light": "#F7EED9",
        "marian-blue": "#1E3A8A",
        "marian-blue-light": "#E8EDFB",
        "terracotta": "#A6322F",
        "terracotta-light": "#FCE8E7",
        "outline": "#8C8275",
        "outline-variant": "#E2DAC8",
        "surface-variant": "#EFE8DC",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        headline: ["'Playfair Display'", "serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      boxShadow: {
        'parchment': '0 4px 20px -2px rgba(46, 40, 35, 0.08)',
        'scriptorium': '0 10px 30px -4px rgba(184, 134, 11, 0.12)',
      }
    },
  },
  plugins: [],
}
