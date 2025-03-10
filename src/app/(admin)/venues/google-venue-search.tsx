'use client'

import React, { useEffect, useRef, useState, useTransition } from 'react'
import { SearchIcon } from '@payloadcms/ui'

import { googleAutoCompleteSearch } from '@/app/actions/venues/googleAutoCompleteSearch'
import { createVenueWithGooglePlaceId } from '@/app/actions/venues/createVenueWithGooglePlaceId'
import { useRouter } from 'next/navigation'

export type GoogleVenueSearchProps = {
  fieldName?: string
  initialParams?: any
  label: string
  setValue?: (arg: string) => void
  value?: string
}

interface Place {
  place_id: string
  description: string
  structured_formatting?: {
    main_text: string
    secondary_text?: string
  }
}

import { usePathname } from 'next/navigation.js'

import { useDebounce } from '@payloadcms/ui'

const listBaseClass = 'list-controls'
const baseClass = 'search-filter'

const GoogleVenueSearch: React.FC<GoogleVenueSearchProps> = (props) => {
  const { initialParams, label } = props
  const pathname = usePathname()
  const [search, setSearch] = useState(
    typeof initialParams?.search === 'string' ? initialParams?.search : undefined,
  )

  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [isPending, startTransition] = useTransition()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [placesSearchError, setPlacesSearchError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // // Close suggestions when clicking outside
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
  //       setShowSuggestions(false);
  //     }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  /**
   * Tracks whether the state should be updated based on the search value.
   * If the value is updated from the URL, we don't want to update the state as it causes additional renders.
   */
  const shouldUpdateState = useRef(true)

  /**
   * Tracks the previous search value to compare with the current debounced search value.
   */
  const previousSearch = useRef(
    typeof initialParams?.search === 'string' ? initialParams?.search : undefined,
  )

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (initialParams?.search !== previousSearch.current) {
      shouldUpdateState.current = false
      setSearch(initialParams?.search as string)
      previousSearch.current = initialParams?.search as string
    }
  }, [initialParams?.search, pathname])

  useEffect(() => {
    if (debouncedSearch !== previousSearch.current && shouldUpdateState.current) {
      // if (handleChange) {
      //   handleChange(debouncedSearch)
      // }
      fetchSuggestions(debouncedSearch)
      previousSearch.current = debouncedSearch
    }
    // }, [debouncedSearch, handleChange])
  }, [debouncedSearch])

  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }

    setError(null)

    startTransition(async () => {
      try {
        // const data = await searchPlaces(input, -33.836031793933465, 151.2123683522662, 50000)
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

  async function handlePlaceSelection(placeId: string) {
    try {
      ;('use server')
      // Add your server action logic here
      // For example:
      // await saveSelectedPlace(place);
      const venue = await createVenueWithGooglePlaceId(placeId)
      router.push(`/admin/collections/venues/${venue.id}`)
    } catch (error) {
      console.error('Error handling place selection:', error)
    }
  }

  return (
    <div className='gutter--left gutter--right collection-list__wrap'>
    <div className={listBaseClass}>
      <div className={`${listBaseClass}__wrap`}>
        <SearchIcon />
        <div className={baseClass} ref={wrapperRef}>
          <input
            aria-label={label}
            className={`${baseClass}__input`}
            id="search-filter-input"
            onChange={(e) => {
              shouldUpdateState.current = true
              setSearch(e.target.value)
            }}
            placeholder={label}
            type="text"
            value={search || ''}
          />
        </div>
      </div>

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
              <a
                onClick={() => handlePlaceSelection(place.place_id)}
                className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
              >
                Create
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}

export default GoogleVenueSearch;