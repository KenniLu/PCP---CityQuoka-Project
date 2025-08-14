import React from 'react'
import type { Location } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Args = {
  location: Location
}

export const LocationCard = ({ location }: Args) => {
  const formatAddress = () => {
    const parts = [location.address, location.city, location.state_province, location.country]
      .filter(Boolean)
    return parts.join(', ')
  }

  const openInMaps = () => {
    if(location.googlePlaceId){
      const url = `https://maps.google.com/?q=place_id:${location.googlePlaceId}`
      window.open(url, '_blank')
    }
    else if (location.latitude && location.longitude) {
      const url = `https://maps.google.com/?q=${location.latitude},${location.longitude}`
      window.open(url, '_blank')
    } else if (location.address) {
      const url = `https://maps.google.com/?q=${encodeURIComponent(formatAddress())}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {location.images && location.images.length > 0 && (
        <div className="aspect-video w-full">
          <Media
            resource={location.images[0].image}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{location.name}</h3>
        
        {/* {location.description && (
          <div className="text-gray-600 mb-4 line-clamp-3">
            <RichText content={location.description} enableGutter={false} />
          </div>
        )} */}
        
        <div className="space-y-2 mt-3">
          {formatAddress() && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">📍</span>
              <button
                onClick={openInMaps}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left"
                title="Open in Google Maps"
              >
                {formatAddress()}
              </button>
            </div>
          )}
          
          {location.phone && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📞</span>
              <a
                href={`tel:${location.phone}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {location.phone}
              </a>
            </div>
          )}
          
          {location.website && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🌐</span>
              <a
                href={location.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}