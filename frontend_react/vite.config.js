import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 백엔드(Spring Boot, application.yaml 기준 실제 포트 8081)와의 CORS 문제를
// Vite 개발 서버 proxy로 해결한다. (NFR-05: proxy 또는 Spring CORS 중 하나만 사용)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
