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

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-bold text-gray-800">
            {isEdit ? 'アイテムを編集' : 'アイテムを追加'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              タイトル <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="例：丸の内のあのフレンチ"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              カテゴリ <span className="text-red-400">*</span>
            </label>
            <select
              value={form.category}
              onChange={set('category')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="">選択してください</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ステータス <span className="text-red-400">*</span></label>
            <select
              value={form.status}
              onChange={set('status')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Invited person */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">誰を誘うか／誘った人</label>
            <input
              type="text"
              value={form.invited_person}
              onChange={set('invited_person')}
              placeholder="例：Aさん、未定"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">行く時期・期限</label>
            <input
              type="date"
              value={form.deadline}
              onChange={set('deadline')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Ticket status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">予約・チケット状況</label>
            <select
              value={form.ticket_status}
              onChange={set('ticket_status')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="">—</option>
              {TICKET_STATUSES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
            <input
              type="url"
              value={form.url}
              onChange={set('url')}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Memo */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">メモ</label>
            <textarea
              value={form.memo}
              onChange={set('memo')}
              rows={3}
              placeholder="自由記述..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? '削除中...' : '削除'}
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-sm px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
