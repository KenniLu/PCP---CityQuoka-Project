'use server'

import { AustralianAddressParser } from '@/utilities/address/australianAddressParser'
import { getPayload } from 'payload'
import config from '@payload-config'


export async function getVenueWithGooglePlaceId(googlePlaceId: string) {
  const payload = await getPayload({ config })
  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured')
  }

  try {
    // Make the request to the Places API v1
    const response = await fetch(`https://places.googleapis.com/v1/places/${googlePlaceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask':
          'attributions,displayName,addressComponents,formattedAddress,shortFormattedAddress,location',
      },
      // body: JSON.stringify(payload),
      // Ensure we get fresh results each time
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('Places API error:', errorData)
      throw new Error('Failed to fetch places')
    }

    const data = await response.json()
    const parser = new AustralianAddressParser()
    const parsedAddress = parser.parse(data.formattedAddress)
    const name = data.displayName.text
    const slug =  name
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .trim().replace(/\s+/g, '-')
                  .concat('-', parsedAddress.postcode);
    return {
      address: data.formattedAddress,
      city: parsedAddress.suburb,
      state_province: parsedAddress.state,
      country: parsedAddress.country,
      postal_code: parsedAddress.postcode,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      googlePlaceId: googlePlaceId,
    }
  } catch (error) {
    console.error('Places API error:', error)
    throw new Error('Failed to fetch places')
  }
}
