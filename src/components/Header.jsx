import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-slate-900 sticky top-0 z-10 border-b border-amber-900/30">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-serif tracking-[0.3em] text-amber-200 text-sm uppercase">
          Venueo
        </span>
        <div className="flex items-center gap-5">
          <span className="text-xs text-slate-500 hidden sm:block">{user?.email}</span>
          <button
            onClick={signOut}
            className="text-xs text-slate-400 hover:text-amber-300 transition-colors tracking-wide"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
}
