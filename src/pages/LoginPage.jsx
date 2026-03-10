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

  const inputClass = "w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white transition-colors"

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 w-full max-w-sm p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-stone-900 mb-1.5">WantDo</h1>
          <p className="text-stone-500 text-sm">
            やりたいことを記録して、<br />計画を実現しよう
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              メールアドレス
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
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
              placeholder={isSignUp ? '英大小文字・数字を含む8文字以上' : 'パスワード'}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs leading-relaxed">{error}</p>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? '処理中...' : isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-stone-500 mt-6">
          {isSignUp ? 'すでにアカウントをお持ちの方は ' : 'アカウントをお持ちでない方は '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="text-teal-600 font-medium hover:underline"
          >
            {isSignUp ? 'ログイン' : '新規登録'}
          </button>
        </p>
      </div>
    </div>
  )
}
