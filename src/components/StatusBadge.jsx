import { STATUSES } from '../lib/constants'

export default function StatusBadge({ status }) {
  const found = STATUSES.find((s) => s.value === status)
  const colorClass = found?.color ?? 'bg-zinc-100 text-zinc-500'
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${colorClass} whitespace-nowrap`}>
      {status}
    </span>
  )
}
