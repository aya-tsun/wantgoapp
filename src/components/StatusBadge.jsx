import { STATUSES } from '../lib/constants'

export default function StatusBadge({ status }) {
  const found = STATUSES.find((s) => s.value === status)
  const colorClass = found?.color ?? 'bg-stone-100 text-stone-500'
  return (
    <span className={`inline-block text-xs px-2 py-0.5 whitespace-nowrap ${colorClass}`}>
      {status}
    </span>
  )
}
