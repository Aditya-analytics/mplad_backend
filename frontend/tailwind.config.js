/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Inter': ['Inter', 'sans-serif'],
        'Outfit': ['Outfit', 'sans-serif'],
      },
      colors: {
        navy: '#0A192F',
        saffron: '#FF9933',
        green: '#138808',
      },
    },
  },
  plugins: [],
}