import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-zinc-950 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.25em] text-white uppercase">WantDo</span>
        <div className="flex items-center gap-5">
          <span className="text-xs text-zinc-500 hidden sm:block">{user?.email}</span>
          <button
            onClick={signOut}
            className="text-xs text-zinc-400 hover:text-white transition-colors tracking-wide"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
}
