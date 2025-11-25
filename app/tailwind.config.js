/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        velaro: {
          orange: '#FF6B35',
          coral: '#FF8C69',
          'orange-light': '#FFA07A',
          'orange-dark': '#FF4500',
          gradient: {
            from: '#FF6B35',
            via: '#FF8C69',
            to: '#FF6B35',
          },
        },
      },
      backgroundImage: {
        'velaro-gradient': 'linear-gradient(135deg, #FF6B35 0%, #FF8C69 100%)',
      },
    },
  },
  plugins: [],
}

