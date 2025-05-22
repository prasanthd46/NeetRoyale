/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // 👈 VERY IMPORTANT
  theme: {
    extend: {
  keyframes: {
    'border-sweep': {
      '0%': { top: '0%', left: '0%' },
      '25%': { top: '0%', left: '100%' },
      '50%': { top: '100%', left: '100%' },
      '75%': { top: '100%', left: '0%' },
      '100%': { top: '0%', left: '0%' },
    },
  },
  animation: {
    'border-sweep': 'border-sweep 4s linear infinite',
    'spin-slow': 'spin 5s linear infinite'
  },
}

  },
  plugins: [],
}
