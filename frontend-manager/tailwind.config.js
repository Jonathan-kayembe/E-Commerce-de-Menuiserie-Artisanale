/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette premium - Style menuiserie artisanale (identique au frontend client)
        primary: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dcc8',
          300: '#d4c4a8',
          400: '#b8935f',
          500: '#8B6F47',
          600: '#6B5233',
          700: '#4a3824',
          800: '#2d2216',
          900: '#1a140d',
        },
        secondary: {
          50: '#fefbf7',
          100: '#fdf6ed',
          200: '#fae9d3',
          300: '#f6d9b8',
          400: '#f0c28d',
          500: '#D4A574',
          600: '#b8935f',
          700: '#8f7149',
          800: '#6b5537',
          900: '#3d3120',
        },
        accent: {
          50: '#f0f7ed',
          100: '#dcefd8',
          200: '#b8dfb1',
          300: '#8cc77a',
          400: '#5fa84a',
          500: '#2D5016',
          600: '#1A3009',
          700: '#142407',
          800: '#0d1804',
          900: '#060b02',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'accent': ['Montserrat', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2rem', { lineHeight: '1.3' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(139, 111, 71, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}

