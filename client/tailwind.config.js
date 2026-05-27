/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        indie: {
          bg: '#faf6ef',
          terracotta: '#d47345',
          sand: '#ebd3b2',
          blue: '#3e5c6a',
          dark: '#28231d',
          clay: '#935338',
          wheat: '#dfcbbb',
        },
        beige: {
          50: '#fdfaf6',
          100: '#f9f2e6',
          200: '#f3e5d3',
          300: '#e8d5bd',
          400: '#d4bc9a',
          500: '#c4a27a',
          600: '#b0885e',
        },
        clay: {
          50: '#faf6f2',
          100: '#f0e6db',
          200: '#e0cfbe',
          300: '#cbb59d',
          400: '#b3967a',
          500: '#9c7a5e',
        },
        sage: {
          50: '#f5f8f0',
          100: '#e6ede0',
          200: '#cfdec4',
          300: '#b2c9a3',
          400: '#94b081',
          500: '#7a9a66',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slow-spin': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}