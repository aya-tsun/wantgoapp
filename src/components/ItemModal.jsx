import { useState, useRef } from 'react'
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
  tags: [],
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
    tags: item.tags ?? [],
  } : EMPTY_FORM)
  const [tagInput, setTagInput] = useState('')
  const tagInputRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const addTag = (raw) => {
    const tag = raw.trim().replace(/,+$/, '').trim()
    if (!tag || form.tags.includes(tag)) return
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
      setTagInput('')
    } else if (e.key === 'Backspace' && tagInput === '' && form.tags.length > 0) {
      setForm((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }))
    }
  }

  const handleTagBlur = () => {
    if (tagInput.trim()) {
      addTag(tagInput)
      setTagInput('')
    }
  }

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

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
      tags: form.tags,
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

  const inputClass = "w-full border-b border-amber-300 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-slate-900 transition-colors"
  const labelClass = "block text-xs tracking-widest text-stone-500 uppercase mb-2"

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-amber-50 w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-slate-900 text-base tracking-wide">
            {isEdit ? 'Edit' : 'Add Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 transition-colors w-7 h-7 flex items-center justify-center"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          <div>
            <label className={labelClass}>タグ</label>
            <div
              className="flex flex-wrap gap-1.5 min-h-[2.25rem] border-b border-amber-300 pb-1.5 pt-1 cursor-text"
              onClick={() => tagInputRef.current?.focus()}
            >
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
                    className="text-slate-400 hover:text-slate-700 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={handleTagBlur}
                placeholder={form.tags.length === 0 ? 'タグを追加 (Enter か , で確定)' : ''}
                className="flex-1 min-w-[8rem] bg-transparent text-sm text-slate-900 placeholder-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-4 pt-2 items-center border-t border-amber-200">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50 mt-4"
              >
                {deleting ? '削除中...' : '削除'}
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="text-xs tracking-wider px-4 py-2 border border-amber-300 text-slate-600 hover:border-slate-900 transition-colors mt-4"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-xs tracking-widest uppercase px-5 py-2 bg-slate-900 text-amber-100 hover:bg-slate-800 transition-colors disabled:opacity-50 mt-4"
            >
              {saving ? '...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
