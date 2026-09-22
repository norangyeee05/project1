import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import * as noticeApi from '../api/noticeApi'

// PRD 8장 상태관리 요구사항(원래 Pinia store)을 React에서는
// Context + useReducer로 구현한다. notices / currentNotice / loading / error 상태와
// fetchNotices / fetchNotice / createNotice / updateNotice / deleteNotice 액션을 그대로 둔다.
const NoticeContext = createContext(null)

const initialState = {
  notices: [],
  currentNotice: null,
  loading: false,
  error: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, loading: true, error: null }
    case 'LOADING_END':
      return { ...state, loading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_NOTICES':
      return { ...state, notices: action.payload }
    case 'SET_CURRENT_NOTICE':
      return { ...state, currentNotice: action.payload }
    case 'CLEAR_CURRENT_NOTICE':
      return { ...state, currentNotice: null }
    default:
      return state
  }
}

export function NoticeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchNotices = useCallback(async () => {
    dispatch({ type: 'LOADING_START' })
    try {
      const data = await noticeApi.getNotices()
      dispatch({ type: 'SET_NOTICES', payload: data })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
    } finally {
      dispatch({ type: 'LOADING_END' })
    }
  }, [])

  const fetchNotice = useCallback(async (id) => {
    dispatch({ type: 'LOADING_START' })
    dispatch({ type: 'CLEAR_CURRENT_NOTICE' })
    try {
      const data = await noticeApi.getNotice(id)
      dispatch({ type: 'SET_CURRENT_NOTICE', payload: data })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
    } finally {
      dispatch({ type: 'LOADING_END' })
    }
  }, [])

  const createNotice = useCallback(async (payload) => {
    try {
      return await noticeApi.createNotice(payload)
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
      throw e
    }
  }, [])

  const updateNotice = useCallback(async (id, payload) => {
    try {
      return await noticeApi.updateNotice(id, payload)
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
      throw e
    }
  }, [])

  const deleteNotice = useCallback(async (id) => {
    try {
      await noticeApi.deleteNotice(id)
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
      throw e
    }
  }, [])

  const value = useMemo(
    () => ({ ...state, fetchNotices, fetchNotice, createNotice, updateNotice, deleteNotice }),
    [state, fetchNotices, fetchNotice, createNotice, updateNotice, deleteNotice]
  )

  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>
}

export function useNoticeStore() {
  const ctx = useContext(NoticeContext)
  if (!ctx) {
    throw new Error('useNoticeStore는 NoticeProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
