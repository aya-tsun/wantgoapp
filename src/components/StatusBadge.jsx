import { STATUSES } from '../lib/constants'

export default function StatusBadge({ status }) {
  const found = STATUSES.find((s) => s.value === status)
  const colorClass = found?.color ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
      {status}
    </span>
  )
}
