import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-stone-800 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-white text-base">WantDo</span>
        <div className="flex items-center gap-5">
          <span className="text-xs text-stone-400 hidden sm:block">{user?.email}</span>
          <button
            onClick={signOut}
            className="text-xs text-stone-300 hover:text-white transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
}
