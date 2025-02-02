'use server'

interface LocationCoordinates {
  latitude: number
  longitude: number
}

interface PlacesRequestPayload {
  input: string
  locationBias?: {
    circle: {
      center: LocationCoordinates
      radius: number
    }
  },
  includedRegionCodes?: [string]
}

export async function googleAutoCompleteSearch(
  input: string,
  latitude: number = -33.836031793933465,
  longitude: number = 151.2123683522662,
  radius: number = 50000,
  includedRegionCodes: [string] = ['au']
) {

  const payload: PlacesRequestPayload = {
    input: input,
    includedRegionCodes
  }

  // Only add location bias if coordinates are provided
  if (latitude !== undefined && longitude !== undefined) {
    payload.locationBias = {
      circle: {
        center: {
          latitude: latitude,
          longitude: longitude,
        },
        radius: radius,
      },
    }
  }

  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured')
  }

  try {
    // Make the request to the Places API v1
    const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      },
      body: JSON.stringify(payload),
      // Ensure we get fresh results each time
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('Places API error:', errorData)
      throw new Error('Failed to fetch places')
    }

    const data = await response.json()

    // console.log(`FETCHED DATA IS ${JSON.stringify(data)}`)
    // Transform the response to match our component's expected format
    return {
      predictions: data.suggestions.map(({ placePrediction: prediction }: any) => {
        return {
          place_id: prediction.placeId,
          description: prediction.text?.text,
          structured_formatting: {
            main_text: prediction.structuredFormat?.mainText?.text,
            secondary_text: prediction.structuredFormat?.secondaryText?.text,
          },
        }
      }),
    }
  } catch (error) {
    console.error('Places API error:', error)
    throw new Error('Failed to fetch places')
  }
}
