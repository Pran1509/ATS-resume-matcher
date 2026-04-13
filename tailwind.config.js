/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0a0a0f',
          800: '#12121a',
          700: '#1c1c28',
          600: '#252535',
        },
        acid: {
          DEFAULT: '#c8f135',
          dim: '#a3c520',
        },
        frost: {
          DEFAULT: '#e8f4ff',
          dim: '#b8d9f8',
        },
        ember: '#ff6b35',
        mist: '#8888aa',
      },
      animation: {
        'score-fill': 'scoreFill 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        scoreFill: {
          '0%': { strokeDashoffset: '339' },
          '100%': { strokeDashoffset: 'var(--target-offset)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
