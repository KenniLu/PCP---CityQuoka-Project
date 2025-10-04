'use client'

export type OfferStatusFilter = 'all' | 'unclaimed' | 'ready' | 'claimed'

type OfferFilterProps = {
  tags: Array<{
    label: string
    value: string | null
  }>
  activeTag: string | null
  onTagChange: (value: string | null) => void
  status: OfferStatusFilter
  onStatusChange: (value: OfferStatusFilter) => void
}

export default function OfferFilter({
  tags,
  activeTag,
  onTagChange,
  status,
  onStatusChange,
}: OfferFilterProps) {
  return (
    <div className="flex justify-between items-center w-full gap-4">
      <nav className="flex justify-evenly w-full md:w-9/12 mx-auto bg-[#FFE2A8] rounded-xl border-2 border-black shadow-md px-3 md:px-6 py-3">
        {tags.map(({ label, value }) => {
          const isActive = activeTag === value

          return (
            <button
              key={label}
              onClick={() => onTagChange(value)}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition ${
                isActive
                  ? 'bg-red-600 text-white border-b-4 border-red-800'
                  : 'bg-gray-200 text-black'
              }`}
              type="button"
            >
              {label}
            </button>
          )
        })}
      </nav>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as OfferStatusFilter)}
        className="bg-gray-200 border border-black text-black text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="all">All</option>
        <option value="unclaimed">Unclaimed</option>
        <option value="ready">Ready to Use</option>
        <option value="claimed">Claimed</option>
      </select>
    </div>
  )
}
