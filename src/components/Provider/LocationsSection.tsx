'use client'

import React, { useState, useEffect } from 'react'
import type { Location } from '@/payload-types'
import { LocationCard } from './LocationCard'
import { SearchInput } from './SearchInput'
import { useRouter, useSearchParams } from 'next/navigation'

type Args = {
  locations: Location[]
  providerId: number
  initialSearchQuery?: string
}

export const LocationsSection = ({ locations, providerId, initialSearchQuery }: Args) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '')
  const [filteredLocations, setFilteredLocations] = useState(locations)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(locations)
    } else {
      const filtered = locations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredLocations(filtered)
    }
  }, [searchQuery, locations])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim() === '') {
      params.delete('search')
    } else {
      params.set('search', query)
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.replace(newUrl, { scroll: false })
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Locations ({locations.length})
        </h2>
        
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search locations by name, city, or address..."
        />
      </div>

      {filteredLocations.length === 0 ? (
        <div className="text-center py-8">
          {searchQuery ? (
            <p className="text-gray-500">
              No locations found matching "{searchQuery}". Try a different search term.
            </p>
          ) : (
            <p className="text-gray-500">
              No locations available for this provider yet.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </section>
  )
}