import api from './axios'

// 검색/페이징 파라미터 없이 전체 목록만 요청한다. (FR-01)
export function getNotices() {
  return api.get('/notices').then((res) => res.data)
}

// 상세 조회 시 백엔드가 hits를 1 증가시킨다. (FR-02)
export function getNotice(id) {
  return api.get(`/notices/${id}`).then((res) => res.data)
}

export function createNotice(payload) {
  return api.post('/notices', payload).then((res) => res.data)
}

export function updateNotice(id, payload) {
  return api.put(`/notices/${id}`, payload).then((res) => res.data)
}

export function deleteNotice(id) {
  return api.delete(`/notices/${id}`)
}
