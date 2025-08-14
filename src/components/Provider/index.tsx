import React from 'react'
import type { Provider, Location } from '@/payload-types'
import { ProviderHero } from './ProviderHero'
import { LocationsSection } from './LocationsSection'
import { PlaceholderSection } from './PlaceholderSection'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChevronRight } from 'lucide-react'

type Args = {
  provider: Provider
  locations: Location[]
  searchQuery?: string
}

const ProviderBreadcrumb = ({ provider }: { provider: Provider }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="text-base text-blue-600">
          <BreadcrumbLink href="/providers">Providers</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight />
        </BreadcrumbSeparator>
        <BreadcrumbItem className="text-base text-blue-600">
          <BreadcrumbLink href={`/providers/${provider.slug}`}>{provider.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function ProviderPage({ provider, locations, searchQuery }: Args) {
  return (
    <article className="w-full">
      <div className="flex flex-col w-full px-2">
        <div className="w-full relative pb-10">
          <div className="w-full flex justify-center max-sm:hidden"></div>

          <div className="flex flex-col md:flex-row w-full gap-4">
            <div className="w-full sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 flex flex-col gap-6">
              
              <article className="w-full max-w-5xl">
                <ProviderBreadcrumb provider={provider} />
                <div className="w-full max-w-5xl">
                  <ProviderHero provider={provider} />
                </div>
                
                <div className="text-xl leading-[135%] mt-8 max-w-[960px] flex flex-col gap-8">
                  <LocationsSection 
                    locations={locations} 
                    providerId={provider.id}
                    initialSearchQuery={searchQuery}
                  />
                  
                  <PlaceholderSection 
                    title="Offers & Deals" 
                    description="Special offers and deals from this provider will appear here."
                    icon="🎁"
                  />
                  
                  <PlaceholderSection 
                    title="Upcoming Events" 
                    description="Events and activities hosted by this provider will appear here."
                    icon="📅"
                  />
                </div>
              </article>
              
            </div>
          </div>
          <div className="h-[30px]"></div>
          <div className="w-full h-[4px] bg-[#EFEFEF] max-w-[300px] mx-auto sm:max-w-[300px]"></div>
        </div>
      </div>
    </article>
  )
}