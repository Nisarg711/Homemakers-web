/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'dark': {
          'bg': 'rgb(var(--color-bg-primary) / <alpha-value>)',
          'bg-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
          'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
          'bg-tertiary': 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
          'bg-hover': 'rgb(var(--color-bg-hover) / <alpha-value>)',
          'border': 'rgb(var(--color-border) / <alpha-value>)',
          'border-light': 'rgb(var(--color-border-light) / <alpha-value>)',
          'text': 'rgb(var(--color-text-primary) / <alpha-value>)',
          'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
          'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        'accent': {
          'primary': 'rgb(var(--color-accent-primary) / <alpha-value>)',
          'secondary': 'rgb(var(--color-accent-secondary) / <alpha-value>)',
          'light': 'rgb(var(--color-accent-light) / <alpha-value>)',
          'dark': 'rgb(var(--color-accent-dark) / <alpha-value>)',
        },
      },
      boxShadow: {
        'dark-sm': '0 1px 2px var(--shadow-color)',
        'dark-md': '0 4px 8px var(--shadow-color)',
        'dark-lg': '0 8px 24px var(--shadow-color)',
        'dark-xl': '0 16px 40px var(--shadow-color)',
        'glow': '0 0 24px var(--shadow-glow)',
        'glow-lg': '0 0 40px var(--shadow-glow)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'slide-down': 'slideDown 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.2)' },
          '50%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};