import { useNavigate } from 'react-router-dom'

export default function HomeView() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4 text-center">
      <span className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200">
        Vibe Coding Project
      </span>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        Notice Project
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-500">
        Spring Boot와 React로 만든 가장 단순한 공지사항 CRUD 학습 프로젝트입니다.
      </p>
      <button
        type="button"
        className="mt-9 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30"
        onClick={() => navigate('/notices')}
      >
        공지사항 바로가기
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  )
}
