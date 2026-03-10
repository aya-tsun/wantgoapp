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
  const [sortByDeadline, setSortByDeadline] = useState(false)
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
    if (sortByDeadline) {
      query = query.order('deadline', { ascending: true, nullsFirst: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (!error) setItems(data ?? [])
    setLoading(false)
  }, [user.id, filterCategory, filterStatus, sortByDeadline])

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

            <div className="flex-1" />

            <button
              onClick={handleAdd}
              className="text-xs tracking-widest uppercase bg-slate-900 text-amber-100 px-5 py-1.5 hover:bg-slate-800 transition-colors"
            >
              ＋ 追加
            </button>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center text-stone-400 py-24 text-sm tracking-wider">読み込み中...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-slate-400 text-base mb-2">— まだ何もありません —</p>
            <p className="text-stone-400 text-xs tracking-wider">「＋ 追加」からやりたいことを登録しましょう</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
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
