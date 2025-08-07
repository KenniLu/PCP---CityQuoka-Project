'use client'

import React, { useState, useEffect, ChangeEvent, useTransition, useRef } from 'react'
import { TextInput, useForm } from '@payloadcms/ui'
import { useDebounce } from '@payloadcms/ui'
import { googleAutoCompleteSearch } from '@/app/actions/venues/googleAutoCompleteSearch'
import { getVenueWithGooglePlaceId } from '@/app/actions/venues/getVenueWithGooglePlaceId'

interface GoogleLocationSearchFieldProps {
  path: string
}

interface Place {
  place_id: string
  description: string
  structured_formatting?: {
    main_text: string
    secondary_text?: string
  }
}

const GoogleLocationSearchField: React.FC<GoogleLocationSearchFieldProps> = ({ path }) => {
  const [value, setValue] = useState<string>('')
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [_, startTransition] = useTransition()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // const { setAddress } = useField({path: 'address'})

  const { dispatchFields, setModified } = useForm()
  const debouncedSearch = useDebounce(value, 500)

  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }

    setError(null)

    startTransition(async () => {
      try {
        const data = await googleAutoCompleteSearch(input)

        if (data.predictions) {
          setShowSuggestions(true)
          setSuggestions(data.predictions)
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        setError('Failed to fetch suggestions. Please try again.')
        setSuggestions([])
      }
    })
  }

  useEffect(() => {
    if (debouncedSearch !== '') {
      fetchSuggestions(debouncedSearch)
    }
  }, [debouncedSearch])

  const handlePlaceSelection = async (place_id: Place['place_id']) => {
    const result = await getVenueWithGooglePlaceId(place_id)

    dispatchFields({
      type: 'UPDATE',
      path: 'address',
      value: result?.address,
    })
    dispatchFields({
      type: 'UPDATE',
      path: 'city',
      value: result?.city,
    })
    dispatchFields({
      type: 'UPDATE',
      path: 'state_province',
      value: result?.state_province,
    })
    dispatchFields({
      type: 'UPDATE',
      path: 'country',
      value: result?.country,
    })
    dispatchFields({
      type: 'UPDATE',
      path: 'postal_code',
      value: result?.postal_code,
    })
    dispatchFields({
      type: 'UPDATE',
      path: 'latitude',
      value: result?.latitude,
    })
    dispatchFields({
      type: 'UPDATE',
      path: 'longitude',
      value: result?.longitude,
    })
    dispatchFields({
      type: 'UPDATE',
      path: 'googlePlaceId',
      value: result?.googlePlaceId,
    })
    setModified(true)
    setShowSuggestions(false)
  }

  return (
    <div>
      <label className="field-label" htmlFor="location-search">
        Address Search
      </label>
      <TextInput
        value={value}
        onChange={(e) => setValue((e as ChangeEvent<HTMLInputElement>).target.value)}
        path="locationSearch"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            marginTop: '0.25rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
          className="absolute z-10 w-full bg-white mt-1 border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((place) => (
            <div
              key={place.place_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                borderBottom: '1px solid #e5e7eb',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <div style={{ flexGrow: 1 }}>
                {place.structured_formatting ? (
                  <>
                    <div
                      style={{
                        fontWeight: 500,
                        color: '#111827',
                      }}
                    >
                      {place.structured_formatting.main_text}
                    </div>
                    {place.structured_formatting.secondary_text && (
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                        }}
                      >
                        {place.structured_formatting.secondary_text}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {place.description}
                  </div>
                )}
              </div>
              <div
                onClick={() => handlePlaceSelection(place.place_id)}
                className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
              >
                Select
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GoogleLocationSearchField
