'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Search, CheckCircle2, Clock3, ChevronDown } from 'lucide-react'

import AppHeader from '@/components/AppHeader'
import ClaimButton from '@/components/ClaimButton'

type Offer = {
  id: number
  title: string
  img: string
  status: 'Claimed' | 'Ready to use' | 'Unclaimed'
  featured: boolean
  nearby: boolean
  week: boolean
  perks: { icon: 'check' | 'clock'; text: string }[]
}

const INITIAL_OFFERS: Offer[] = [
  {
    id: 1,
    title: 'Sydney Harbour Sightseeing Cruise Morning or Afternoon Departure',
    img: '/sydney.jpg',
    status: 'Unclaimed',
    featured: true,
    nearby: false,
    week: true,
    perks: [
      { icon: 'check', text: 'Free Cancellation' },
      { icon: 'clock', text: 'Expires in 5 days' },
    ],
  },
  {
    id: 2,
    title: 'Big Night Out at Parramatta',
    img: '/parramatta.jpg',
    status: 'Unclaimed',
    featured: true,
    nearby: true,
    week: true,
    perks: [
      { icon: 'check', text: 'Free Cancellation' },
      { icon: 'clock', text: 'Expires in 5 days' },
    ],
  },
  {
    id: 3,
    title: 'Enjoy fine dine this Christmas at Sydney Eye Tower',
    img: '/tower.jpg',
    status: 'Ready to use',
    featured: false,
    nearby: true,
    week: false,
    perks: [
      { icon: 'check', text: 'Free Cancellation' },
      { icon: 'clock', text: 'Expires in 40 days' },
    ],
  },
]

export default function MyOffersPage() {
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'Featured' | 'Nearby' | 'This week'>('Featured')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Claimed' | 'Ready to use' | 'Unclaimed'>('All')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [popupOffer, setPopupOffer] = useState<Offer | null>(null)

  const handleClaimClick = (offer: Offer) => {
    if (offer.status === 'Unclaimed') {
      setPopupOffer(offer)
    } else if (offer.status === 'Ready to use') {
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? { ...o, status: 'Claimed' } : o)))
    }
  }

  const confirmRedeem = () => {
    if (popupOffer) {
      setOffers((prev) =>
        prev.map((o) => (o.id === popupOffer.id ? { ...o, status: 'Ready to use' } : o)),
      )
      setPopupOffer(null)
    }
  }

  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase())
      const matchesTab =
        (activeTab === 'Featured' && o.featured) ||
        (activeTab === 'Nearby' && o.nearby) ||
        (activeTab === 'This week' && o.week)
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter
      return matchesSearch && matchesTab && matchesStatus
    })
  }, [offers, search, activeTab, statusFilter])

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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 pr-10 text-[15px] placeholder:text-gray-400 outline-none focus:border-blue-500"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="inline-flex items-center justify-between rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 min-w-[170px]"
            >
              {statusFilter === 'All' ? 'Filter Offers' : statusFilter}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-black/10 z-10">
                {['All', 'Claimed', 'Ready to use', 'Unclaimed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as typeof statusFilter)
                      setDropdownOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                      statusFilter === status ? 'font-semibold text-black' : 'text-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-3 text-center text-[15px] font-medium text-gray-800">
              {(['Featured', 'Nearby', 'This week'] as const).map((tab) => (
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
        <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col">
          {filteredOffers.length > 0 ? (
            <div className="flex-1 flex flex-col justify-start space-y-5">
              {filteredOffers.map((offer) => (
                <article
                  key={offer.id}
                  className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
                >
                  <div className="relative h-[110px] w-[160px] shrink-0 overflow-hidden rounded-xl bg-gray-200">
                    <Image src={offer.img} alt={offer.title} fill className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-[17px] font-semibold text-gray-900">
                      {offer.title}
                    </h3>

                    <ul className="mt-2 space-y-1.5 text-[13px] text-gray-700">
                      {offer.perks.map((p, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {p.icon === 'check' ? (
                            <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                          ) : (
                            <Clock3 className="h-4 w-4 text-gray-700" />
                          )}
                          <span>{p.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:ml-auto">
                    <ClaimButton status={offer.status} onClick={() => handleClaimClick(offer)} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No offers match your filters right now.</p>
          )}
        </div>
      </main>

      {popupOffer && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Redeem Offer?</h2>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to mark “{popupOffer.title}” as ready to use?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setPopupOffer(null)}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedeem}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
