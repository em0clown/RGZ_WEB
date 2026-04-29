/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#4d17cdff',
        'custom-pink': '#0ed97aff',
        'custom-dark': '#0F0F0F',
        'custom-card': '#1A1A1A',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #a2cd23ff 0%, #07b804ff 100%)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
