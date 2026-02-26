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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Filter / Sort bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">すべてのカテゴリ</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">すべてのステータス</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <button
              onClick={() => setSortByDeadline((v) => !v)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                sortByDeadline
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
              }`}
            >
              📅 期限順
            </button>

            <div className="flex-1" />

            <button
              onClick={handleAdd}
              className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              ＋ 追加
            </button>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center text-gray-400 py-16 text-sm">読み込み中...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌟</div>
            <p className="text-gray-500 text-sm">まだアイテムがありません。</p>
            <p className="text-gray-400 text-xs mt-1">「＋ 追加」からやりたいことを登録しよう！</p>
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
