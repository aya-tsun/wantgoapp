import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES, STATUSES, TICKET_STATUSES } from '../lib/constants'

const EMPTY_FORM = {
  title: '',
  category: '',
  status: '未着手',
  invited_person: '',
  deadline: '',
  ticket_status: '',
  url: '',
  memo: '',
}

export default function ItemModal({ item, onClose, onSaved }) {
  const { user } = useAuth()
  const isEdit = !!item
  const [form, setForm] = useState(isEdit ? {
    title: item.title ?? '',
    category: item.category ?? '',
    status: item.status ?? '未着手',
    invited_person: item.invited_person ?? '',
    deadline: item.deadline ?? '',
    ticket_status: item.ticket_status ?? '',
    url: item.url ?? '',
    memo: item.memo ?? '',
  } : EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です'); return }
    if (!form.category) { setError('カテゴリは必須です'); return }
    setError('')
    setSaving(true)

    const payload = {
      title: form.title.trim(),
      category: form.category,
      status: form.status,
      invited_person: form.invited_person || null,
      deadline: form.deadline || null,
      ticket_status: form.ticket_status || null,
      url: form.url || null,
      memo: form.memo || null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEdit) {
      result = await supabase.from('items').update(payload).eq('id', item.id)
    } else {
      result = await supabase.from('items').insert({ ...payload, user_id: user.id })
    }

    setSaving(false)
    if (result.error) {
      setError('保存に失敗しました: ' + result.error.message)
    } else {
      onSaved()
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('このアイテムを削除しますか？')) return
    setDeleting(true)
    const { error } = await supabase.from('items').delete().eq('id', item.id)
    setDeleting(false)
    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      onSaved()
    }
  }

  const inputClass = "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white transition-colors"
  const labelClass = "block text-xs font-medium text-stone-600 mb-1"

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-stone-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-bold text-stone-900 text-base">
            {isEdit ? 'アイテムを編集' : 'アイテムを追加'}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelClass}>タイトル <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="例：丸の内のあのフレンチ"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>カテゴリ <span className="text-red-400">*</span></label>
            <select value={form.category} onChange={set('category')} className={inputClass}>
              <option value="">選択してください</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>ステータス</label>
            <select value={form.status} onChange={set('status')} className={inputClass}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>誰を誘うか／誘った人</label>
            <input
              type="text"
              value={form.invited_person}
              onChange={set('invited_person')}
              placeholder="例：Aさん、未定"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>行く時期・期限</label>
            <input
              type="date"
              value={form.deadline}
              onChange={set('deadline')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>予約・チケット状況</label>
            <select value={form.ticket_status} onChange={set('ticket_status')} className={inputClass}>
              <option value="">—</option>
              {TICKET_STATUSES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>URL</label>
            <input
              type="url"
              value={form.url}
              onChange={set('url')}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>メモ</label>
            <textarea
              value={form.memo}
              onChange={set('memo')}
              rows={3}
              placeholder="自由記述..."
              className={inputClass + ' resize-none'}
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2 items-center">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {deleting ? '削除中...' : '削除'}
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-sm px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
