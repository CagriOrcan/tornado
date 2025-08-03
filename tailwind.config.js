/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        tornado: {
          primary: '#FF8C42',
          'primary-dark': '#E85D04',
          secondary: '#FFD3B5',
          accent: '#FF6B2B',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'tornado-gradient': 'linear-gradient(135deg, #FF8C42 0%, #E85D04 100%)',
        'tornado-gradient-subtle': 'linear-gradient(135deg, #FFD3B5 0%, #FF8C42 100%)',
      },
      animation: {
        'tornado-spin': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'tornado': '0 10px 25px -5px rgba(255, 140, 66, 0.3)',
        'tornado-lg': '0 20px 40px -10px rgba(255, 140, 66, 0.4)',
      },
    },
  },
  plugins: [],
}

