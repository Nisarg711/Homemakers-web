/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Refined dark theme palette
        'dark': {
          'bg': '#0a0a0f',
          'bg-secondary': '#12121a',
          'bg-tertiary': '#16161f',
          'bg-hover': '#1e1e2a',
          'border': '#22222f',
          'border-light': '#2a2a38',
          'text': '#e8e8eb',
          'text-secondary': '#a0a0a8',
          'text-muted': '#7a7a82',
        },
        'accent': {
          'primary': '#3b82f6',
          'secondary': '#1e40af',
          'light': '#60a5fa',
          'dark': '#1e3a8a',
        },
      },
      boxShadow: {
        'dark-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px rgba(0, 0, 0, 0.6)',
        'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.7)',
        'dark-xl': '0 20px 25px rgba(0, 0, 0, 0.8)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};