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

  const inputClass = "w-full bg-transparent border-b border-zinc-300 px-0 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xs">
        <div className="mb-12">
          <h1 className="text-xs font-bold tracking-[0.3em] text-zinc-900 uppercase mb-3">WantDo</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            やりたいことを、かたちにしよう
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="メールアドレス"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
              placeholder={isSignUp ? 'パスワード（英大小文字・数字を含む8文字以上）' : 'パスワード'}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs leading-relaxed">{error}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white text-sm py-3 tracking-wide hover:bg-zinc-700 transition-colors disabled:opacity-40"
            >
              {loading ? '処理中...' : isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </div>
        </form>

        <p className="text-xs text-zinc-400 mt-8 text-center">
          {isSignUp ? 'すでにアカウントをお持ちの方は ' : 'アカウントをお持ちでない方は '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors"
          >
            {isSignUp ? 'ログイン' : '新規登録'}
          </button>
        </p>
      </div>
    </div>
  )
}
