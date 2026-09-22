import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useNoticeStore } from '../store/NoticeContext.jsx'
import Pagination from '../components/Pagination.jsx'

const PAGE_SIZE = 10

export default function NoticeListView() {
  const { notices, loading, error, fetchNotices } = useNoticeStore()
  const [searchParams, setSearchParams] = useSearchParams()

  // 검색어/현재 페이지는 URL query에서 읽어온다. (FR-07, AC-10)
  const keyword = searchParams.get('keyword') || ''
  const pageParam = Number(searchParams.get('page'))
  const currentPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  useEffect(() => {
    fetchNotices()
  }, [fetchNotices])

  function updateParams(next) {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([key, value]) => {
      const isEmptyKeyword = key === 'keyword' && !value
      const isFirstPage = key === 'page' && Number(value) <= 1
      if (value === undefined || value === null || isEmptyKeyword || isFirstPage) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })
    setSearchParams(params)
  }

  // title/content/author 대상, 대소문자 구분 없이 검색한다. (FR-06)
  const filteredNotices = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return notices
    return notices.filter((notice) =>
      [notice.title, notice.content, notice.author]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(kw))
    )
  }, [notices, keyword])

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / PAGE_SIZE))

  // 전체 목록 -> 검색 필터 -> filteredNotices -> 10건 slice -> 현재 페이지 출력 (FR-07)
  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredNotices.slice(start, start + PAGE_SIZE)
  }, [filteredNotices, currentPage])

  // 검색 결과가 줄어들어 현재 페이지가 범위를 벗어나면 마지막 페이지로 보정한다.
  useEffect(() => {
    if (currentPage > totalPages) {
      updateParams({ page: totalPages })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages])

  // 검색어가 바뀌면 1페이지로 돌아간다. (FR-06)
  function onSearchInput(event) {
    updateParams({ keyword: event.target.value, page: 1 })
  }

  function onPageChange(page) {
    updateParams({ page })
  }

  function formatDate(value) {
    return value ? value.replace('T', ' ').slice(0, 16) : ''
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">공지사항</h1>
          <p className="mt-1 text-sm text-slate-500">
            전체 <span className="font-semibold text-indigo-600">{filteredNotices.length}</span>건
          </p>
        </div>
        <Link
          to="/notices/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          공지사항 등록
        </Link>
      </div>

      <div className="relative mt-6">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="h-5 w-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="제목, 내용, 작성자로 검색"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          value={keyword}
          onChange={onSearchInput}
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            불러오는 중...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-20 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            {error}
          </div>
        ) : paginatedNotices.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="h-12 w-12">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-19.5 0v6a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25v-6m-19.5 0h5.379a1.5 1.5 0 0 1 1.06.44l.777.779a1.5 1.5 0 0 0 1.06.44h3.198a1.5 1.5 0 0 0 1.06-.44l.777-.779a1.5 1.5 0 0 1 1.06-.44H21.75"
              />
            </svg>
            <p className="text-sm">데이터가 없습니다.</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="w-16 px-5 py-3">번호</th>
                <th className="px-3 py-3">제목</th>
                <th className="w-32 px-3 py-3">작성자</th>
                <th className="w-24 px-3 py-3 text-right">조회수</th>
                <th className="w-40 px-5 py-3 text-right">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedNotices.map((notice) => (
                <tr key={notice.id} className="transition hover:bg-indigo-50/50">
                  <td className="px-5 py-3.5 text-slate-400">{notice.id}</td>
                  <td className="max-w-0 px-3 py-3.5">
                    <Link
                      to={`/notices/${notice.id}`}
                      className="block truncate font-medium text-slate-800 hover:text-indigo-600"
                    >
                      {notice.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-600">
                        {notice.author?.charAt(0)}
                      </span>
                      {notice.author}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-3.5 w-3.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      {notice.hits}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-slate-400">{formatDate(notice.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
    </div>
  )
}
