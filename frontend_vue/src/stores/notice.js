import { defineStore } from 'pinia'
import * as noticeApi from '../api/noticeApi'

// PRD 8장 상태관리 요구사항: notices / currentNotice / loading / error
export const useNoticeStore = defineStore('notice', {
  state: () => ({
    notices: [],
    currentNotice: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchNotices() {
      this.loading = true
      this.error = null
      try {
        this.notices = await noticeApi.getNotices()
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async fetchNotice(id) {
      this.loading = true
      this.error = null
      this.currentNotice = null
      try {
        this.currentNotice = await noticeApi.getNotice(id)
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async createNotice(payload) {
      this.error = null
      try {
        return await noticeApi.createNotice(payload)
      } catch (e) {
        this.error = e.message
        throw e
      }
    },
    async updateNotice(id, payload) {
      this.error = null
      try {
        return await noticeApi.updateNotice(id, payload)
      } catch (e) {
        this.error = e.message
        throw e
      }
    },
    async deleteNotice(id) {
      this.error = null
      try {
        await noticeApi.deleteNotice(id)
      } catch (e) {
        this.error = e.message
        throw e
      }
    }
  }
})
