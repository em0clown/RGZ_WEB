/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Замените эти цвета на ваши из Figma
        'primary': '#8B5CF6',     // Фиолетовый
        'secondary': '#EC4899',   // Розовый
        'dark': '#0F0F0F',        // Тёмный фон
        'darker': '#0A0A0A',      // Ещё темнее
        'card': '#1A1A1A',        // Карточки
        'border': '#2A2A2A',      // Границы
        'text-primary': '#FFFFFF', // Основной текст
        'text-secondary': '#A1A1AA', // Второстепенный текст
        'hover': '#2D2D2D',       // Ховер
      },
      fontFamily: {
        // Шрифты из Figma
        'sans': ['Proxima Nova'],
        'display': ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        // Размеры из Figma
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      spacing: {
        // Отступы из Figma
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        // Скругления из Figma
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
