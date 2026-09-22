import axios from 'axios'

// Base URL은 /api로 고정하고, 실제 백엔드 주소는 vite.config.js의 proxy 설정을 사용한다.
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 공통 API 오류 처리 위치를 하나로 유지한다. (NFR-03)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || '서버와 통신 중 오류가 발생했습니다.'
    return Promise.reject(new Error(message))
  }
)

export default api
