import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validatePassword = (pw) => {
    if (pw.length < 8) return 'パスワードは8文字以上にしてください'
    if (!/[a-z]/.test(pw)) return 'パスワードに英小文字を含めてください'
    if (!/[A-Z]/.test(pw)) return 'パスワードに英大文字を含めてください'
    if (!/[0-9]/.test(pw)) return 'パスワードに数字を含めてください'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (isSignUp) {
      const pwError = validatePassword(password)
      if (pwError) { setError(pwError); return }
    }
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border-b border-amber-300 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-slate-900 transition-colors"

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xs">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="font-serif tracking-[0.4em] text-slate-900 text-2xl uppercase mb-3">
            Venueo
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-amber-400/50" />
            <p className="text-stone-500 text-xs tracking-wider">
              {isSignUp ? 'アカウント作成' : 'ようこそ'}
            </p>
            <div className="flex-1 h-px bg-amber-400/50" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs tracking-widest text-stone-500 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-stone-500 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
              placeholder={isSignUp ? '英大小文字・数字を含む8文字以上' : '••••••••'}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs leading-relaxed">{error}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-amber-100 text-xs tracking-widest uppercase py-3 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? '...' : isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-stone-400 mt-8">
          {isSignUp ? 'すでにアカウントをお持ちの方は ' : 'アカウントをお持ちでない方は '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="text-slate-700 underline underline-offset-2 hover:text-amber-700 transition-colors"
          >
            {isSignUp ? 'ログイン' : '新規登録'}
          </button>
        </p>
      </div>
    </div>
  )
}
