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
        dev: {
          bg: '#0D1117',
          panel: '#161B22',
          surface: '#21262D',
          border: '#30363D',
          highlight: '#484F58',
          accent: '#58A6FF',
          accentGlow: 'rgba(88, 166, 255, 0.1)',
          text: '#F0F6FC',
          muted: '#8B949E',
          comment: '#8B949E',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
