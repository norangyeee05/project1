import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useNoticeStore } from '../store/NoticeContext.jsx'

function isValidId(rawId) {
  const id = Number(rawId)
  return Number.isInteger(id) && id > 0
}

// 등록(/notices/new)과 수정(/notices/:id/edit)에서 하나의 컴포넌트를 재사용한다. (7.4)
export default function NoticeFormView() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentNotice, error: storeError, fetchNotice, createNotice, updateNotice } = useNoticeStore()

  const isEdit = location.pathname.endsWith('/edit')

  const [form, setForm] = useState({ title: '', content: '', author: '' })
  const [errors, setErrors] = useState({ title: '', content: '', author: '' })
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    if (!isValidId(id)) {
      navigate('/notices', { replace: true })
      return
    }
    fetchNotice(Number(id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id])

  useEffect(() => {
    if (isEdit && currentNotice) {
      setForm({
        title: currentNotice.title,
        content: currentNotice.content,
        author: currentNotice.author
      })
    } else if (isEdit && storeError) {
      setLoadError(storeError)
    }
  }, [isEdit, currentNotice, storeError])

  // 프런트엔드 입력 검증: title/author 공백 불가 + 길이 제한, content 공백 불가 (FR-08)
  function validate() {
    const nextErrors = {
      title: !form.title.trim()
        ? '제목을 입력하세요.'
        : form.title.length > 200
          ? '제목은 최대 200자까지 입력할 수 있습니다.'
          : '',
      content: !form.content.trim() ? '내용을 입력하세요.' : '',
      author: !form.author.trim()
        ? '작성자를 입력하세요.'
        : form.author.length > 50
          ? '작성자는 최대 50자까지 입력할 수 있습니다.'
          : ''
    }
    setErrors(nextErrors)
    return !nextErrors.title && !nextErrors.content && !nextErrors.author
  }

  function onChange(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = { title: form.title, content: form.content, author: form.author }
      if (isEdit) {
        await updateNotice(Number(id), payload)
        navigate(`/notices/${id}`)
      } else {
        const created = await createNotice(payload)
        navigate(`/notices/${created.id}`)
      }
    } catch (e) {
      window.alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  function onCancel() {
    navigate(-1)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800">{isEdit ? '공지사항 수정' : '공지사항 등록'}</h1>

      {loadError ? (
        <div className="mt-6 text-center text-red-500">{loadError}</div>
      ) : (
        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">제목</label>
            <input
              type="text"
              maxLength={200}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={form.title}
              onChange={onChange('title')}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">내용</label>
            <textarea
              rows={8}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={form.content}
              onChange={onChange('content')}
            />
            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">작성자</label>
            <input
              type="text"
              maxLength={50}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={form.author}
              onChange={onChange('author')}
            />
            {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onCancel}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
