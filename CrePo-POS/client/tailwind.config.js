/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-fast': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      colors: {
        'primary-light': '#E9D5FF',   
        'primary-main': '#C084FC',    
        'primary-dark': '#A855F7',    
        'primary-text': '#581C87',    

        'bg-main': '#F5F3FF',        
        'sidebar-bg': '#F1F0FF', // สีพื้นหลัง Sidebar ที่เข้มขึ้นเล็กน้อย
        'content-bg': '#FFFFFF',     

        'accent-pink': '#F472B6',
        'accent-sky': '#38BDF8',
        'accent-teal': '#2DD4BF',
        'accent-green': '#34D399',
        'accent-red': '#F87171',
        'accent-yellow': '#FBBF24',
        
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        'border-color': '#E2E8F0', 
      },
      fontFamily: {
        'sans': ['Sarabun', 'sans-serif'],
      },
      boxShadow: {
        'main': '0 4px 12px 0 rgb(0 0 0 / 0.05)',
        'lifted': '0 10px 20px -5px rgb(0 0 0 / 0.07)',
      },
      borderRadius: {
        'xl': '1rem', 
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
