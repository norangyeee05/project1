import { Route, Routes, Link } from 'react-router-dom'
import HomeView from './views/HomeView.jsx'
import NoticeListView from './views/NoticeListView.jsx'
import NoticeDetailView from './views/NoticeDetailView.jsx'
import NoticeFormView from './views/NoticeFormView.jsx'

// 9장 라우팅 요구사항: / , /notices, /notices/new, /notices/:id, /notices/:id/edit
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              📋
            </span>
            Notice
          </Link>
          <Link
            to="/notices"
            className="text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            공지사항 목록
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/notices" element={<NoticeListView />} />
        <Route path="/notices/new" element={<NoticeFormView />} />
        <Route path="/notices/:id" element={<NoticeDetailView />} />
        <Route path="/notices/:id/edit" element={<NoticeFormView />} />
      </Routes>
    </div>
  )
}
