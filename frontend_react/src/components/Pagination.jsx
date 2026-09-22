export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null

  function go(page) {
    if (page < 1 || page > totalPages || page === currentPage) return
    onChange(page)
  }

  return (
    <nav className="mt-8 flex items-center justify-center">
      <div className="inline-flex items-center gap-0.5 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30"
          disabled={currentPage === 1}
          onClick={() => go(currentPage - 1)}
          aria-label="이전 페이지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-medium transition ${
              page === currentPage
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => go(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30"
          disabled={currentPage === totalPages}
          onClick={() => go(currentPage + 1)}
          aria-label="다음 페이지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
