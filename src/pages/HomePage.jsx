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

  const selectClass = "text-xs border border-zinc-200 rounded px-2.5 py-1.5 bg-white text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center mb-6">
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
            className={`text-xs px-2.5 py-1.5 rounded border transition-colors ${
              sortByDeadline
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            期限順
          </button>

          <div className="flex-1" />

          <button
            onClick={handleAdd}
            className="text-xs bg-zinc-900 text-white px-4 py-1.5 rounded hover:bg-zinc-700 transition-colors tracking-wide"
          >
            ＋ 追加
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center text-zinc-400 py-20 text-xs tracking-widest">読み込み中</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-sm mb-1">まだアイテムがありません</p>
            <p className="text-zinc-300 text-xs">「＋ 追加」からやりたいことを登録しよう</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
