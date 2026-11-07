/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Lato', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        'brand-gold': '#C0A080',
        'brand-gold-dark': '#8C6D47',
        'brand-gold-light': '#EFE5DA',
        'brand-gold-subtle': '#F8F4EE',
        'brand-charcoal': '#111827',
        'brand-dark': '#0B0B0C',
        'brand-cream': '#FDFBF7',
        'brand-ivory': '#FAF9F6',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(192, 160, 128, 0.15)',
        'elevation-1': '0 4px 20px -2px rgba(17, 24, 39, 0.05)',
        'elevation-2': '0 12px 30px -4px rgba(17, 24, 39, 0.08)',
        'elevation-3': '0 24px 50px -12px rgba(17, 24, 39, 0.12)',
        'gold-glow': '0 0 25px rgba(192, 160, 128, 0.35)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};

