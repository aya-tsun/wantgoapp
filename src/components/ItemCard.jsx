import StatusBadge from './StatusBadge'

export default function ItemCard({ item, onEdit }) {
  const deadline = item.deadline
    ? new Date(item.deadline).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
    : null

  return (
    <div
      onClick={() => onEdit(item)}
      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug flex-1 line-clamp-2">
          {item.title}
        </h3>
        <StatusBadge status={item.status} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
          {item.category}
        </span>
        {item.ticket_status && item.ticket_status !== '未対応' && (
          <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
            予約: {item.ticket_status}
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs text-gray-500">
        {item.invited_person && (
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{item.invited_person}</span>
          </div>
        )}
        {deadline && (
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{deadline}</span>
          </div>
        )}
        {item.url && (
          <div className="flex items-center gap-1 overflow-hidden">
            <span>🔗</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-500 hover:underline truncate"
            >
              {item.url}
            </a>
          </div>
        )}
        {item.memo && (
          <div className="flex items-start gap-1">
            <span>📝</span>
            <span className="line-clamp-2">{item.memo}</span>
          </div>
        )}
      </div>
    </div>
  )
}
