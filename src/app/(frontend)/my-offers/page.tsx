'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Search, CheckCircle2, Clock3, ChevronDown } from 'lucide-react'

import AppHeader from '@/components/AppHeader'
import ClaimButton from '@/components/ClaimButton'

// Shape returned by the offers API.
type Offer = {
  id: number | string
  title: string
  summary: string
  status: 'unclaimed' | 'ready' | 'claimed'
  startsAt: string | null
  expiresAt: string | null
  tags: string[]
  coverImage: null | {
    id: number | string
    alt: string | null
    url: string | null
  }
}

type OfferApiResponse = {
  docs: Offer[]
  hasNextPage: boolean
  nextPage: number | null
  totalDocs: number
  totalPages: number
}

type OfferStatusFilter = 'all' | 'unclaimed' | 'ready' | 'claimed'
type OfferTab = 'Featured' | 'Nearby' | 'This week'

// Tabs are displayed with friendly names, but the API expects these slug values.
const TAB_TO_TAG: Record<OfferTab, string> = {
  Featured: 'featured',
  Nearby: 'nearby',
  'This week': 'this-week',
}

// Dropdown labels shown to the user for each backend status value.
const STATUS_LABELS: Record<OfferStatusFilter, string> = {
  all: 'All Offers',
  unclaimed: 'Unclaimed',
  ready: 'Ready to Use',
  claimed: 'Claimed',
}

// Format incoming ISO strings for the UI while tolerating null or invalid dates.
const formatDate = (value: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return null
  return date.toLocaleDateString()
}

// Convert stored tag slugs into readable titles for the perks list.
const formatTags = (tags: string[]) =>
  tags
    .map((tag) => {
      switch (tag) {
        case 'featured':
          return 'Featured'
        case 'nearby':
          return 'Nearby'
        case 'this-week':
          return 'This Week'
        default:
          return tag
      }
    })
    .join(', ')

export default function MyOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<OfferTab>('Featured')
  const [statusFilter, setStatusFilter] = useState<OfferStatusFilter>('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    // Pull a fresh page of offers whenever the selected tab or status changes.
    const fetchOffers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        const tag = TAB_TO_TAG[activeTab]
        if (tag) {
          params.set('tag', tag)
        }
        if (statusFilter !== 'all') {
          params.set('status', statusFilter)
        }

        const queryString = params.toString()
        // Include cookies so Payload can resolve the user and provider context server-side.
        const response = await fetch(`/api/offers${queryString ? `?${queryString}` : ''}`, {
          credentials: 'include',
          signal: controller.signal,
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          const message = (data as { error?: string }).error || 'Unable to load offers right now.'
          throw new Error(message)
        }

        const payload = (data as OfferApiResponse).docs ?? []
        setOffers(payload)
      } catch (fetchError) {
        if (controller.signal.aborted) return
        // Reset results if the request fails so the UI reflects the empty state.
        const message =
          fetchError instanceof Error ? fetchError.message : 'Unable to load offers right now.'
        setError(message)
        setOffers([])
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchOffers()

    return () => controller.abort()
  }, [activeTab, statusFilter])

  // Apply an in-memory text filter on the server results to avoid extra round-trips.
  const filteredOffers = useMemo(() => {
    if (!search.trim()) {
      return offers
    }

    const query = search.trim().toLowerCase()
    return offers.filter((offer) =>
      [offer.title, offer.summary, formatTags(offer.tags)]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query)),
    )
  }, [offers, search])

  const currentStatusLabel = STATUS_LABELS[statusFilter]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader />

      <div className="bg-white border-b shadow-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 pr-10 text-[15px] placeholder:text-gray-400 outline-none focus:border-blue-500"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="inline-flex items-center justify-between rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 min-w-[170px]"
            >
              {currentStatusLabel}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-black/10 z-10">
                {(
                  [
                    ['all', 'All'],
                    ['unclaimed', 'Unclaimed'],
                    ['ready', 'Ready to Use'],
                    ['claimed', 'Claimed'],
                  ] as Array<[OfferStatusFilter, string]>
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setStatusFilter(value)
                      setDropdownOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                      statusFilter === value ? 'font-semibold text-black' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-3 text-center text-[15px] font-medium text-gray-800">
              {(['Featured', 'Nearby', 'This week'] as OfferTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative py-3 transition-colors hover:text-black"
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="pointer-events-none absolute inset-x-10 -bottom-[2px] h-[2px] rounded-full bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col bg-gray-100 min-h-[calc(100vh-180px)]">
        <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col space-y-5">
          {isLoading && <p className="text-sm text-gray-500">Loading offers...</p>}

          {error && !isLoading && <p className="text-sm text-red-600">{error}</p>}

          {!isLoading && !error && filteredOffers.length === 0 && (
            <p className="text-sm text-gray-600">No offers match your filters right now.</p>
          )}

          {filteredOffers.map((offer) => {
            const imageUrl = offer.coverImage?.url ?? '/sydney.jpg'
            const altText = offer.coverImage?.alt || offer.title
            const formattedStarts = formatDate(offer.startsAt)
            const formattedExpires = formatDate(offer.expiresAt)
            const readableTags = offer.tags.length > 0 ? formatTags(offer.tags) : null

            return (
              <article
                key={offer.id}
                className="flex flex-col md:flex-row items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="relative h-[180px] w-full md:h-[140px] md:w-[210px] shrink-0 overflow-hidden rounded-xl bg-gray-200">
                  <Image src={imageUrl} alt={altText} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base md:text-[17px] font-semibold text-gray-900">{offer.title}</h3>
                      <p className="text-[13px] text-gray-700 leading-relaxed">{offer.summary}</p>
                    </div>

                    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-gray-700">
                      {readableTags && (
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                          <span>{readableTags}</span>
                        </li>
                      )}
                      {formattedStarts && (
                        <li className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-gray-700" />
                          <span>Starts {formattedStarts}</span>
                        </li>
                      )}
                      {formattedExpires && (
                        <li className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-gray-700" />
                          <span>Expires {formattedExpires}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="md:ml-auto">
                  <ClaimButton status={offer.status} />
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
