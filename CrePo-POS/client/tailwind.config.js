/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#E9D5FF',   // ม่วงอ่อนมาก
        'primary-main': '#C084FC',    // ม่วงพาสเทลหลัก
        'primary-dark': '#A855F7',    // ม่วงเข้ม (สำหรับปุ่ม หรือ active)
        'primary-text': '#581C87',    // ตัวอักษรม่วงเข้ม

        'bg-main': '#F5F3FF',         // พื้นหลังหลัก (ม่วงอ่อนมากๆๆ)
        'sidebar-bg': '#FFFFFF',      // พื้นหลัง Sidebar
        'content-bg': '#FFFFFF',      // พื้นหลังของเนื้อหา

        'accent-pink': '#F472B6',
        'accent-sky': '#38BDF8',
        'accent-teal': '#2DD4BF',
        'accent-green': '#34D399',
        'accent-red': '#F87171',
        'accent-yellow': '#FBBF24',
        
        'text-primary': '#1E293B',    // สีเทาเข้ม
        'text-secondary': '#64748B',  // สีเทา
        'border-color': '#E2E8F0',    // สีเส้นขอบ (อ่อนลง)
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