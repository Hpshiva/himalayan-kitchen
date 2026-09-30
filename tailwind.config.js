/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        himalayan: {
          // Dark Theme (Mountain Night & Metamorphic Slate)
          void: '#050607',
          black: '#0a0c0e',
          charcoal: '#121518',
          slate: '#1c2024',
          stone: '#2c3238',
          fog: '#828a94',
          ivory: '#f4f0e8',
          bone: '#e5ded1',
          amber: '#d9642a',
          ember: '#e0531b',
          brass: '#c29b53',
          gold: '#dfb76c',
          moss: '#243329',

          // Light Theme (Glacial Snow Peak & Chiseled Limestone)
          lightBg: '#f7f5f0',
          lightSurface: '#efebe2',
          lightCard: '#e7e2d6',
          lightBorder: '#d5cdbf',
          lightText: '#12161b',
          lightMuted: '#5d6773',
        }
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
