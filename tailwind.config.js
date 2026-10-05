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
        // warm charcoal — never blue-black
        ink: {
          950: '#0B0A09',
          900: '#100F0D',
          850: '#141311',
          800: '#191816',
          700: '#1E1D1A',
          600: '#26241F',
          500: '#33302A',
          400: '#4A463E',
          line: '#24221E',
          edge: '#33302A',
        },
        // ochre — the one accent
        signal: {
          DEFAULT: '#E9B949',
          deep: '#C99A2E',
          dim: 'rgba(233,185,73,0.10)',
        },
        pass: {
          DEFAULT: '#7FB069',
          dim: 'rgba(127,176,105,0.12)',
        },
        fail: {
          DEFAULT: '#D9694A',
          dim: 'rgba(217,105,74,0.12)',
        },
        // restrained: clue reads as bone, trace as steel
        clue: {
          DEFAULT: '#CBBDA6',
          dim: 'rgba(203,189,166,0.10)',
        },
        trace: {
          DEFAULT: '#8FA3AD',
          dim: 'rgba(143,163,173,0.10)',
        },
        fg: {
          DEFAULT: '#E9E4DA',
          dim: '#B3AB9D',
          mute: '#8A8377',
        },
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['Archivo', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '1px',
        md: '2px',
        lg: '2px',
        xl: '3px',
        '2xl': '3px',
      },
      boxShadow: {
        // flat by design — depth comes from hairlines, not glow
        panel: 'none',
        lift: '0 18px 32px -26px rgba(0,0,0,0.9)',
        press: 'inset 0 2px 4px 0 rgba(0,0,0,0.45)',
        signal: 'none',
        rail: '0 1px 0 0 rgba(0,0,0,0.5)',
      },
      keyframes: {
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-5px)' },
          '30%': { transform: 'translateX(4px)' },
          '45%': { transform: 'translateX(-3px)' },
          '60%': { transform: 'translateX(2px)' },
          '80%': { transform: 'translateX(-1px)' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wipe: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        blink: 'blink 1.05s steps(1,end) infinite',
        shake: 'shake 0.45s cubic-bezier(.36,.07,.19,.97) both',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
        'rise-in': 'rise-in 0.5s cubic-bezier(.16,1,.3,1) both',
        wipe: 'wipe 0.5s cubic-bezier(.16,1,.3,1) both',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
