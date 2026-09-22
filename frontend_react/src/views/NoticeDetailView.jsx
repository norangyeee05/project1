import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useNoticeStore } from '../store/NoticeContext.jsx'

// id 파라미터가 양의 정수인지 검증한다. (9장 라우팅 요구사항)
function isValidId(rawId) {
  const id = Number(rawId)
  return Number.isInteger(id) && id > 0
}

export default function NoticeDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentNotice, loading, error, fetchNotice, deleteNotice } = useNoticeStore()

  // 상세 조회 시 백엔드가 hits를 1 증가시키고, 증가된 조회수를 그대로 표시한다. (FR-02, AC-02)
  useEffect(() => {
    if (!isValidId(id)) {
      navigate('/notices', { replace: true })
      return
    }
    fetchNotice(Number(id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function formatDate(value) {
    return value ? value.replace('T', ' ').slice(0, 16) : ''
  }

  async function onDelete() {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteNotice(Number(id))
      navigate('/notices')
    } catch (e) {
      window.alert(e.message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {loading ? (
        <div className="text-center text-gray-500">불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : currentNotice ? (
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{currentNotice.title}</h1>
          <div className="mt-2 flex gap-4 text-sm text-gray-500">
            <span>작성자 {currentNotice.author}</span>
            <span>조회수 {currentNotice.hits}</span>
            <span>{formatDate(currentNotice.createdAt)}</span>
          </div>
          <div className="mt-6 whitespace-pre-wrap rounded-lg border border-gray-200 p-4 text-gray-700">
            {currentNotice.content}
          </div>
          <div className="mt-6 flex justify-between">
            <Link
              to="/notices"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              목록
            </Link>
            <div className="flex gap-2">
              <Link
                to={`/notices/${id}/edit`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                수정
              </Link>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={onDelete}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
