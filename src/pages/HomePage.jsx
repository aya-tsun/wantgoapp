import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES, STATUSES } from '../lib/constants'
import Header from '../components/Header'
import ItemCard from '../components/ItemCard'
import ItemModal from '../components/ItemModal'

export default function HomePage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [sortByDeadline, setSortByDeadline] = useState(false)
  const [hideArchived, setHideArchived] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)

    if (filterCategory) query = query.eq('category', filterCategory)
    if (filterStatus) query = query.eq('status', filterStatus)
    if (hideArchived) query = query.not('status', 'in', '("完了","見送り")')
    if (sortByDeadline) {
      query = query.order('deadline', { ascending: true, nullsFirst: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (!error) setItems(data ?? [])
    setLoading(false)
  }, [user.id, filterCategory, filterStatus, sortByDeadline, hideArchived])

  const allTags = [...new Set(items.flatMap((item) => item.tags ?? []))].sort()
  const displayedItems = filterTag
    ? items.filter((item) => item.tags?.includes(filterTag))
    : items

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleAdd = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  const handleSaved = () => {
    handleModalClose()
    fetchItems()
  }

  const selectClass = "text-xs tracking-wider border border-amber-300 bg-amber-50 text-slate-700 px-3 py-1.5 focus:outline-none focus:border-slate-900 transition-colors"

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="border border-amber-200 bg-white/60 p-4 mb-8">
          <div className="flex flex-wrap gap-2.5 items-center">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={selectClass}
            >
              <option value="">すべてのカテゴリ</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={selectClass}
            >
              <option value="">すべてのステータス</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <button
              onClick={() => setSortByDeadline((v) => !v)}
              className={`text-xs tracking-wider px-3 py-1.5 border transition-colors ${
                sortByDeadline
                  ? 'bg-slate-900 text-amber-200 border-slate-900'
                  : 'bg-transparent text-slate-600 border-amber-300 hover:border-slate-900 hover:text-slate-900'
              }`}
            >
              期限順
            </button>

            <button
              onClick={() => setHideArchived((v) => !v)}
              className={`text-xs tracking-wider px-3 py-1.5 border transition-colors ${
                hideArchived
                  ? 'bg-slate-900 text-amber-200 border-slate-900'
                  : 'bg-transparent text-slate-600 border-amber-300 hover:border-slate-900 hover:text-slate-900'
              }`}
            >
              進行中のみ
            </button>

            <div className="flex-1" />

            <button
              onClick={handleAdd}
              className="text-sm font-bold tracking-widest uppercase bg-amber-400 text-slate-900 px-6 py-2 shadow-md hover:bg-amber-300 active:scale-95 transition-all"
            >
              ＋ 追加
            </button>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-amber-100">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                  className={`text-xs px-2 py-0.5 border transition-colors ${
                    filterTag === tag
                      ? 'bg-slate-900 text-amber-100 border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-300 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center text-stone-400 py-24 text-sm tracking-wider">読み込み中...</div>
        ) : displayedItems.length === 0 ? (
          <div className="text-center py-24">
            {filterTag ? (
              <p className="font-serif text-slate-400 text-base mb-2">— 「{filterTag}」のアイテムはありません —</p>
            ) : (
              <>
                <p className="font-serif text-slate-400 text-base mb-2">— まだ何もありません —</p>
                <p className="text-stone-400 text-xs tracking-wider">「＋ 追加」からやりたいことを登録しましょう</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedItems.map((item) => (
              <ItemCard key={item.id} item={item} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <ItemModal
          item={editingItem}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
