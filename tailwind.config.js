/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07080A',
          900: '#0A0C0E',
          850: '#0D1013',
          800: '#111417',
          700: '#161A1E',
          600: '#1C2126',
          500: '#242A30',
          400: '#333A42',
          line: '#21262B',
          edge: '#2E353C',
        },
        signal: {
          DEFAULT: '#FFC53D',
          deep: '#E0A20F',
          dim: 'rgba(255,197,61,0.12)',
        },
        pass: {
          DEFAULT: '#54D67C',
          dim: 'rgba(84,214,124,0.12)',
        },
        fail: {
          DEFAULT: '#FF6B57',
          dim: 'rgba(255,107,87,0.12)',
        },
        clue: {
          DEFAULT: '#FF5CA8',
          dim: 'rgba(255,92,168,0.12)',
        },
        trace: {
          DEFAULT: '#5AC8E8',
          dim: 'rgba(90,200,232,0.12)',
        },
        fg: {
          DEFAULT: '#EDEFF2',
          dim: '#99A2AD',
          mute: '#69717B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['Archivo', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        panel:
          'inset 0 1px 0 0 rgba(255,255,255,0.025), 0 14px 34px -22px rgba(0,0,0,0.95)',
        lift: 'inset 0 1px 0 0 rgba(255,255,255,0.04), 0 28px 52px -26px rgba(0,0,0,1)',
        press: 'inset 0 2px 5px 0 rgba(0,0,0,0.55)',
        signal: '0 10px 30px -14px rgba(255,197,61,0.55)',
        rail: '0 1px 0 0 rgba(0,0,0,0.6)',
      },
      keyframes: {
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-7px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(3px)' },
          '80%': { transform: 'translateX(-1px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.35', transform: 'scale(0.75)' },
        },
        'sweep': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1,end) infinite',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        scan: 'scan 3.4s linear infinite',
        ticker: 'ticker 38s linear infinite',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        'sweep': 'sweep 2.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 3.2s linear infinite',
        'rise-in': 'rise-in 0.45s cubic-bezier(.16,1,.3,1) both',
      },
    },
  },
  plugins: [],
}
