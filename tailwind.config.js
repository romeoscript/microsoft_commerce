/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        bounce: 'bounce 0.6s infinite ease-in-out alternate',
      },
      animationDelay: {
        200: '0.2s',
        400: '0.4s',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        sm: ['14px', '1.5rem'], // 14px
        base: ['20px', '1.5rem'], // 20px
        lg: ['24px', '1.5rem'], // 24px
        xl: ['32px', '1.5rem'], // 32px
      },
      colors: {
        accent: '#219653', // Example accent color
        'gray-dark': '#2d3748',
        'gray-light': '#a0aec0',
        red: {
          DEFAULT: '#EB5757', // Main red color
          light: '#FF9494',
          dark: '#C02020',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Nunito', 'sans-serif']
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.delay-200': {
          animationDelay: '0.2s',
        },
        '.delay-400': {
          animationDelay: '0.4s',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    require("flowbite/plugin")

  ],};
