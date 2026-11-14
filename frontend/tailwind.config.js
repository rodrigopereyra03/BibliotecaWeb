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
        "warm-charcoal": "#4A433D", /* Higher contrast for senior readability */
        "gold-burnished": "#A67508", /* Slightly deeper for accessibility contrast */
        "gold-accent": "#B8860B",
        "gold-light": "#F7EED9",
        "marian-blue": "#1E3A8A",
        "marian-blue-light": "#E8EDFB",
        "terracotta": "#A6322F",
        "terracotta-light": "#FCE8E7",
        "outline": "#786E62",
        "outline-variant": "#D9CFBC",
        "surface-variant": "#EFE8DC",
      },
      fontSize: {
        '2xs': ['0.825rem', { lineHeight: '1.25rem' }],
        'xs': ['0.95rem', { lineHeight: '1.45rem' }],
        'sm': ['1.075rem', { lineHeight: '1.6rem' }],
        'base': ['1.22rem', { lineHeight: '1.8rem' }],
        'lg': ['1.38rem', { lineHeight: '1.95rem' }],
        'xl': ['1.6rem', { lineHeight: '2.15rem' }],
        '2xl': ['1.95rem', { lineHeight: '2.45rem' }],
        '3xl': ['2.4rem', { lineHeight: '2.85rem' }],
        '4xl': ['3rem', { lineHeight: '3.4rem' }],
        '5xl': ['3.85rem', { lineHeight: '1.15' }],
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
