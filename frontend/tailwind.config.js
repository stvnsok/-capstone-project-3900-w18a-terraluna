/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    colors: {
      tl: {
        'inactive-white': '#f2f2f2',
        'active-white': '#ffffff',
        'inactive-blue': '#4FFFC0',
        'active-blue': '#2461FF',
        'inactive-green': '#A8F59B',
        'active-green': '#4BB03A',
        'inactive-red': '#FF7E7E',
        'active-red': '#FF3030',
        'inactive-black': '#282828',
        'active-black': '#000000',
        'inactive-grey': '#8e8e8e',
        'active-grey': '#4d4d4d',
        'inactive-brown': '#FFF2F2'
      }
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  plugins: [],
}
