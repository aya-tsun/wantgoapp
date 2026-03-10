import StatusBadge from './StatusBadge'

const IconUsers = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="5" r="2.5"/>
    <path d="M1.5 13.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"/>
    <path d="M11 2.5a2.5 2.5 0 010 5"/>
    <path d="M14.5 13.5a4.5 4.5 0 00-3.5-4.4"/>
  </svg>
)

const IconCalendar = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="2.5" width="13" height="12" rx="1.5"/>
    <path d="M5 1v3M11 1v3M1.5 6.5h13"/>
  </svg>
)

const IconLink = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 9.5l3-3"/>
    <path d="M5 7.5L3.5 9A3.182 3.182 0 008 13.5l1.5-1.5"/>
    <path d="M8 3.5L9.5 2A3.182 3.182 0 0114 6.5L12.5 8"/>
  </svg>
)

const IconNote = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 4h10M3 7.5h10M3 11h6"/>
  </svg>
)

export default function ItemCard({ item, onEdit }) {
  const deadline = item.deadline
    ? new Date(item.deadline).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
    : null

  return (
    <div
      onClick={() => onEdit(item)}
      className="bg-white border border-amber-200 p-4 cursor-pointer hover:shadow-md hover:border-amber-400 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-serif text-slate-900 text-sm leading-snug flex-1 line-clamp-2">
          {item.title}
        </h3>
        <StatusBadge status={item.status} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5">
          {item.category}
        </span>
        {item.ticket_status && item.ticket_status !== '未対応' && (
          <span className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5">
            予約: {item.ticket_status}
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-stone-500">
        {item.invited_person && (
          <div className="flex items-center gap-1.5">
            <IconUsers />
            <span>{item.invited_person}</span>
          </div>
        )}
        {deadline && (
          <div className="flex items-center gap-1.5">
            <IconCalendar />
            <span>{deadline}</span>
          </div>
        )}
        {item.url && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <IconLink />
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-amber-700 hover:underline truncate"
            >
              {item.url.replace(/^https?:\/\//, '').split('/')[0]}
            </a>
          </div>
        )}
        {item.memo && (
          <div className="flex items-start gap-1.5">
            <IconNote />
            <span className="line-clamp-2 text-stone-400">{item.memo}</span>
          </div>
        )}
      </div>
    </div>
  )
}
