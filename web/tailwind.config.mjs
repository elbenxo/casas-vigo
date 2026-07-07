/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Atlantic cerulean → deep navy (the Rías Baixas sea)
        primary: {
          50: '#eef6fb',
          100: '#d5e9f5',
          200: '#aed6ec',
          300: '#78bce0',
          400: '#429ccb',
          500: '#1f7db0',
          600: '#16638f',
          700: '#175074',
          800: '#17415c',
          900: '#14324a',
        },
        // Warm coral — sunset over the ría
        accent: {
          50: '#fff4f0',
          100: '#ffe5db',
          200: '#ffc7b5',
          300: '#ffa387',
          400: '#fb7a56',
          500: '#f15a32',
          600: '#db4322',
          700: '#b5341b',
          800: '#8f2a18',
          900: '#6d2214',
        },
        // Warm sand neutrals
        sand: {
          50: '#fdfaf4',
          100: '#f6efe1',
          200: '#ecdfc9',
          300: '#ddcaa9',
          400: '#c7b087',
          500: '#a89170',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(16, 42, 67, 0.07), 0 10px 20px -2px rgba(16, 42, 67, 0.04)',
        'lift': '0 18px 50px -18px rgba(16, 42, 67, 0.28), 0 4px 12px -4px rgba(16, 42, 67, 0.08)',
        'card': '0 1px 2px rgba(16, 42, 67, 0.04), 0 12px 28px -14px rgba(16, 42, 67, 0.16)',
        'glow-accent': '0 12px 34px -8px rgba(241, 90, 50, 0.35)',
        'glow-primary': '0 14px 40px -10px rgba(31, 125, 176, 0.38)',
      },
      backgroundImage: {
        'sea': 'linear-gradient(135deg, #17415c 0%, #14324a 55%, #0e2839 100%)',
        'sea-radial': 'radial-gradient(120% 120% at 0% 0%, #1f7db0 0%, #17415c 45%, #10293b 100%)',
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
