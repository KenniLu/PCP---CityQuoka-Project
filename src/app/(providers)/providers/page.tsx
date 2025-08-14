import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Provider } from '@/payload-types'
import { Media } from '@/components/Media'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const providers = await payload.find({
    collection: 'providers',
    depth: 1,
    limit: 12,
    overrideAccess: true,
  })

  return (
    <div className="pt-4 pb-4">
      <div className="container mb-4">
        <div className="prose dark:prose-invert max-w-none">
          <h2>Our Providers</h2>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.docs.map((provider: Provider) => (
            <a key={provider.id} href={`/providers/${provider.slug}`} className="block group">
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 p-4">
                  {provider.logo && (
                    <Media
                      priority={false}
                      imgClassName="w-[200px] object-cover"
                      resource={provider.logo}
                      size="184px"
                      maxWidth={368}
                    />
                  )}
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                      {provider.name}
                    </h2>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `City Quokka - Providers`,
  }
}
