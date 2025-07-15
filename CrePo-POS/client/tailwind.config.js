/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#6D28D9', // สีม่วงหลัก
        'brand-secondary': '#A78BFA', // สีม่วงรอง
        'brand-light': '#EDE9FE', // สีม่วงอ่อน
        'brand-dark': '#4C1D95', // สีม่วงเข้ม
        'accent-pink': '#EC4899', // สีชมพูสำหรับเน้น
        'accent-green': '#10B981', // สีเขียวสำหรับสถานะ
        'accent-red': '#EF4444', // สีแดงสำหรับแจ้งเตือน
        'accent-yellow': '#F59E0B', // สีเหลือง
        'bg-main': '#F9FAFB', // สีพื้นหลังหลัก (เทาอ่อน)
        'content-bg': '#FFFFFF', // สีพื้นหลังของเนื้อหา
        'text-primary': '#1F2937', // สีตัวอักษรหลัก
        'text-secondary': '#6B7280', // สีตัวอักษรรอง
        'border-color': '#E5E7EB', // สีเส้นขอบ
      },
      fontFamily: {
        'sans': ['Sarabun', 'sans-serif'], // เปลี่ยนฟอนต์หลักเป็น "สารบรรณ"
      },
      boxShadow: {
        'main': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        'lifted': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}