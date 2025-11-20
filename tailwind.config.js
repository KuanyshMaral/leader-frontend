/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Цвета из вашего брендбука (пример.odt)
        leader: {
          dark: '#1D194C',       // Темно-синий (Фон меню)
          blue: '#1E3567',       // Синий (Второстепенный)
          cyan: '#008FD6',       // Голубой/Тиффани (Основной акцент)
          tiffany: '#3CE8D1',    // Яркий Тиффани (для кнопок/иконок)
          red: '#FF521D',        // Красный/Оранжевый (Акцент/Важное)
          gray: '#F3F4F6',       // Светло-серый (Фон рабочей области)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Рекомендую подключить шрифт Inter или Roboto
      }
    },
  },
  plugins: [],
}