'use client'

import Image from 'next/image'
import { CircleCheckBig, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

import Footer from '@/components/Footer/'
import OfferFilter, { type OfferStatusFilter } from '@/components/OfferFilter/'
import ClaimButton from '@/components/ClaimButtons/'

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

const TAG_OPTIONS = [
  { label: 'All', value: null },
  { label: 'Featured', value: 'featured' },
  { label: 'Nearby', value: 'nearby' },
  { label: 'This Week', value: 'this-week' },
]

const STATUS_BADGE_TEXT: Record<'startsAt' | 'expiresAt', string> = {
  startsAt: 'Starts',
  expiresAt: 'Expires',
}

export default function MyOffer() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(TAG_OPTIONS[0]?.value ?? null)
  const [statusFilter, setStatusFilter] = useState<OfferStatusFilter>('all')

  useEffect(() => {
    const controller = new AbortController()

    const fetchOffers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (activeTag) {
          params.set('tag', activeTag)
        }

        if (statusFilter !== 'all') {
          params.set('status', statusFilter)
        }

        const queryString = params.toString()
        const response = await fetch(`/api/offers${queryString ? `?${queryString}` : ''}`, {
          credentials: 'include',
          signal: controller.signal,
        })

        if (!response.ok) {
          const message = response.status === 401 ? 'You must be signed in to view offers.' : 'Unable to load offers right now.'
          throw new Error(message)
        }

        const data: OfferApiResponse = await response.json()
        setOffers(data.docs || [])
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Something went wrong while fetching offers.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchOffers()

    return () => controller.abort()
  }, [activeTag, statusFilter])

  const hasOffers = offers.length > 0

  const renderDate = (date: string | null, key: 'startsAt' | 'expiresAt') => {
    if (!date) return null
    const formatted = new Date(date).toLocaleDateString()
    return (
      <p className="flex items-center gap-2 text-gray-600">
        <Clock size={16} />
        <span className="text-sm">
          <strong>{STATUS_BADGE_TEXT[key]}:</strong> {formatted}
        </span>
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFBB63] p-6 rounded-3xl border border-black space-y-6 overflow-x-hidden">
      <nav>
        <OfferFilter
          tags={TAG_OPTIONS}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </nav>

      <main className="space-y-4">
        {isLoading && <p className="text-center text-sm text-gray-700">Loading offers…</p>}
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
        {!isLoading && !error && !hasOffers && (
          <p className="text-center text-sm text-gray-600">No offers match your filters right now.</p>
        )}

        <div className="grid gap-4 w-full">
          {offers.map((offer) => {
            const imageUrl = offer.coverImage?.url ?? '/sydney.jpg'
            const altText = offer.coverImage?.alt || offer.title

            return (
              <article
                key={offer.id}
                className="relative flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow"
              >
                <div className="relative w-full md:w-64 h-48">
                  <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    sizes="(min-width: 768px) 256px, 100vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>

                <div className="flex-1 p-4 flex flex-col gap-2">
                  <h2 className="text-lg font-bold">{offer.title}</h2>
                  <p className="text-sm text-gray-600">{offer.summary}</p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <CircleCheckBig size={16} />
                    <span className="capitalize">{offer.status}</span>
                  </p>
                  {renderDate(offer.startsAt, 'startsAt')}
                  {renderDate(offer.expiresAt, 'expiresAt')}
                </div>

                <div className="absolute bottom-4 right-4">
                  <ClaimButton status={offer.status} />
                </div>
              </article>
            )
          })}
        </div>
      </main>

      <nav className="flex flex-col flex-grow-0">
        <Footer />
      </nav>
    </div>
  )
}
