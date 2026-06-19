/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        clay: {
          50: '#FBF5F2',
          100: '#F5E6DE',
          200: '#EBC9B8',
          300: '#E0A98F',
          400: '#D98964',
          500: '#D97757',
          600: '#C25D3E',
          700: '#A14A30',
          800: '#7A3925',
          900: '#522618',
        },
        cream: {
          50: '#FDFBF8',
          100: '#FAF7F2',
          200: '#F3EDE2',
          300: '#E9DFCB',
          400: '#DBCDAA',
          500: '#C9B58A',
        },
        bark: {
          50: '#F5F2F0',
          100: '#E6E0DB',
          200: '#CCC0B6',
          300: '#AFA091',
          400: '#8C7A68',
          500: '#6B5A4A',
          600: '#524438',
          700: '#3E2C24',
          800: '#2C1F1A',
          900: '#1A130F',
        },
        moss: {
          50: '#F3F7EC',
          100: '#E3EDD3',
          200: '#C8DBA8',
          300: '#A6C475',
          400: '#86AA4B',
          500: '#6B8E23',
          600: '#54701A',
          700: '#405414',
          800: '#2E3C0F',
          900: '#1C2408',
        },
        terracotta: {
          50: '#FEF6EE',
          100: '#FCE7D3',
          200: '#F9CCA3',
          300: '#F4A86B',
          400: '#ED7D33',
          500: '#B45309',
          600: '#92400E',
          700: '#78350F',
          800: '#5C2E0D',
          900: '#431407',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'number-roll': 'numberRoll 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        numberRoll: {
          '0%': { transform: 'translateY(-5px)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px -4px rgba(62, 44, 36, 0.1), 0 2px 10px -2px rgba(62, 44, 36, 0.05)',
        'card-hover': '0 12px 40px -8px rgba(62, 44, 36, 0.15), 0 6px 20px -4px rgba(62, 44, 36, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(62, 44, 36, 0.05)',
      },
    },
  },
  plugins: [],
};
