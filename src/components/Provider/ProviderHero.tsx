import React from 'react'
import type { Provider } from '@/payload-types'
import { Media } from '@/components/Media'

type Args = {
  provider: Provider
}

export const ProviderHero = ({ provider }: Args) => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {provider.logo && (
            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <Media
                resource={provider.logo}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{provider.name}</h1>
              {provider.verificationStatus === 'verified' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
            
            {provider.description && (
              <p className="text-lg text-gray-600 mb-6">{provider.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.email && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📧</span>
                  <a href={`mailto:${provider.email}`} className="text-blue-600 hover:underline">
                    {provider.email}
                  </a>
                </div>
              )}
              
              {provider.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📞</span>
                  <a href={`tel:${provider.phone}`} className="text-blue-600 hover:underline">
                    {provider.phone}
                  </a>
                </div>
              )}
              
              {provider.website && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🌐</span>
                  <a 
                    href={provider.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              
              {provider.address && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span className="text-gray-700">{provider.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {provider.images && provider.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {provider.images.slice(0, 3).map((img, index) => (
              <div key={index} className="aspect-video rounded-lg overflow-hidden">
                <Media
                  resource={img.image}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}