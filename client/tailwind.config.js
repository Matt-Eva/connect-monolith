/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        '10': 'repeat(10, minmax(0, 1fr))'
      },
      gridTemplateColumns: {
        'header': 'calc(100vw - 160px) 100px 60px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

