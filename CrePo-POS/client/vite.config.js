    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      server: {
        proxy: {
          // นี่คือส่วนสำคัญที่บอกว่า:
          // ถ้ามีการเรียก API ไปที่ '/api' ให้ส่งต่อไปที่เซิร์ฟเวอร์ของเราที่พอร์ต 5000
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
          },
        },
      },
    })
    