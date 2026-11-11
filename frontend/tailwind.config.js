/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0eeff',
          100: '#e2ddfe',
          200: '#c7bcfd',
          300: '#a593fb',
          400: '#8365f5',
          500: '#6955E8', // Primary PRD color
          600: '#563fe0',
          700: '#472fc9',
          800: '#3c27a6',
          900: '#322384',
        },
        admin: {
          primary: '#6955E8',
          secondary: '#477BEE',
          accent: '#17B897',
          bg: '#F7F8FC',
          card: '#FFFFFF',
          text: '#18213A',
          muted: '#737D91',
          border: '#E8EAF2',
          success: '#18A878',
          warning: '#F4A640',
          error: '#E45B69',
        },
        teal: {
          50: '#e6faf5',
          100: '#c1f3e7',
          500: '#17B897',
          600: '#139b7f',
          700: '#107f69',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'admin-card': '0 1px 3px 0 rgba(24, 33, 58, 0.04), 0 1px 2px -1px rgba(24, 33, 58, 0.02)',
        'admin-hover': '0 10px 25px -5px rgba(105, 85, 232, 0.08), 0 8px 10px -6px rgba(105, 85, 232, 0.04)',
        'admin-dropdown': '0 10px 30px -5px rgba(24, 33, 58, 0.12), 0 4px 6px -2px rgba(24, 33, 58, 0.04)',
      },
    },
  },
  plugins: [],
};
