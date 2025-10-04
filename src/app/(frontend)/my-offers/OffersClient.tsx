'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { CircleCheckBig, Clock } from 'lucide-react'

import Footer from '@/components/Footer'
import OfferFilter from '@/components/OfferFilter'
import ClaimButton from '@/components/ClaimButtons'
import type { Media, Offer } from '@/payload-types'

const FALLBACK_IMAGE = '/sydney.jpg'

const TAG_LABELS: Record<string, string> = {
  featured: 'Featured',
  nearby: 'Nearby',
  'this-week': 'This Week',
}

type OfferStatus = NonNullable<Offer['status']>

const STATUS_LABELS: Record<OfferStatus, string> = {
  unclaimed: 'Unclaimed offer',
  ready: 'Ready to use',
  claimed: 'Claimed offer',
}

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Unclaimed', value: 'unclaimed' },
  { label: 'Ready to Use', value: 'ready' },
  { label: 'Claimed', value: 'claimed' },
]

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'No expiration date'
  try {
    return new Intl.DateTimeFormat('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value))
  } catch (error) {
    return 'Invalid date'
  }
}

const getOfferImage = (image: Offer['coverImage']) => {
  if (!image) {
    return { src: FALLBACK_IMAGE, alt: 'Offer image placeholder' }
  }

  if (typeof image === 'number') {
    return { src: FALLBACK_IMAGE, alt: 'Offer image placeholder' }
  }

  const media = image as Media

  if (media?.url) {
    return { src: media.url, alt: media.alt ?? 'Offer image' }
  }

  if (media?.filename) {
    const prefix = process.env.NEXT_PUBLIC_SERVER_URL || ''
    return {
      src: `${prefix}/media/${media.filename}`,
      alt: media.alt ?? 'Offer image',
    }
  }

  return { src: FALLBACK_IMAGE, alt: 'Offer image placeholder' }
}

type OffersClientProps = {
  offers: Offer[]
}

const OffersClient = ({ offers }: OffersClientProps) => {
  const tagOptions = useMemo(() => {
    const tags = new Set<string>()
    for (const offer of offers) {
      if (Array.isArray(offer.tags)) {
        offer.tags.forEach((tag) => tags.add(tag))
      }
    }

    const sortedTags = Array.from(tags).sort((a, b) => {
      const labelA = TAG_LABELS[a] ?? a
      const labelB = TAG_LABELS[b] ?? b
      return labelA.localeCompare(labelB)
    })

    return [
      { label: 'All', value: 'all' },
      ...sortedTags.map((tag) => ({
        label: TAG_LABELS[tag] ?? tag,
        value: tag,
      })),
    ]
  }, [offers])

  const [activeTag, setActiveTag] = useState<string>(tagOptions[0]?.value ?? 'all')
  const [statusFilter, setStatusFilter] = useState<'all' | OfferStatus>('all')

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesTag =
        activeTag === 'all' || (Array.isArray(offer.tags) && offer.tags.includes(activeTag))

      const offerStatus = (offer.status ?? 'unclaimed') as OfferStatus

      const matchesStatus =
        statusFilter === 'all' || offerStatus === statusFilter

      return matchesTag && matchesStatus
    })
  }, [offers, activeTag, statusFilter])

  const activeTagLabel = useMemo(() => {
    const option = tagOptions.find((option) => option.value === activeTag)
    return option?.label ?? 'Offers'
  }, [tagOptions, activeTag])

  return (
    <div className="min-h-screen bg-[#FFBB63] p-6 rounded-3xl border-l-background border-black space-y-6">
      <nav>
        <OfferFilter
          options={tagOptions}
          activeValue={activeTag}
          onChange={setActiveTag}
          statusOptions={STATUS_OPTIONS}
          statusValue={statusFilter}
          onStatusChange={(value) => {
            if (value === 'all' || value === 'unclaimed' || value === 'ready' || value === 'claimed') {
              setStatusFilter(value)
            }
          }}
        />
      </nav>

      <main className="grid grid-flow-row gap-4 w-full">
        {filteredOffers.length === 0 ? (
          <div className="flex justify-center py-12 text-base font-semibold text-gray-700">
            No {activeTagLabel.toLowerCase()} offers match the selected filters yet.
          </div>
        ) : (
          filteredOffers.map((offer) => {
            const offerStatus = (offer.status ?? 'unclaimed') as OfferStatus
            const { src, alt } = getOfferImage(offer.coverImage)

            return (
              <div
                key={offer.id}
                className="relative flex w-full bg-white rounded-xl overflow-hidden shadow"
              >
                <div className="relative h-full w-[200px] min-w-[200px]">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>

                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h2 className="text-lg font-bold">{offer.title}</h2>
                  <p className="flex items-center gap-2 text-gray-600">
                    <CircleCheckBig size={16} /> {offer.summary}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} /> {formatDate(offer.expiresAt)}
                  </p>
                  <p className="text-sm text-gray-500">{STATUS_LABELS[offerStatus]}</p>
                </div>

                <div className="absolute bottom-4 right-4">
                  <ClaimButton initialStatus={offerStatus} />
                </div>
              </div>
            )
          })
        )}
      </main>

      <nav className="flex flex-col flex-grow-0">
        <Footer />
      </nav>
    </div>
  )
}

export default OffersClient
