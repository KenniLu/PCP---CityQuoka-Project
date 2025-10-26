'use client';

import React, { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export type SavedPlace = {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number | null;
  types?: string[];
  savedAt: string;
};

type GoogleMapProps = {
  center: google.maps.LatLngLiteral;
  savedPlaces: SavedPlace[];
  onSavePlace: (place: SavedPlace) => void;
  focusLocation?: google.maps.LatLngLiteral | null;
  newPinMode?: boolean;
  /** Controlled text for manual search (TextSearch) */
  searchQuery: string;
  /** Increment to trigger search */
  searchTrigger: number;
  /** Map zoom when focusing a specific place */
  focusZoom?: number;
  /** (Optional) Pass an external input ref to enable Places Autocomplete */
  bindAutocompleteInputRef?: React.RefObject<HTMLInputElement>;
};

export default function GoogleMap({
  center,
  savedPlaces,
  onSavePlace,
  focusLocation,
  newPinMode = false,
  searchQuery,
  searchTrigger,
  focusZoom = 15,
  bindAutocompleteInputRef,
}: GoogleMapProps) {
  const divRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const placesRef = useRef<google.maps.places.PlacesService | null>(null);

  const searchMarkersRef = useRef<google.maps.Marker[]>([]);
  const savedMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  // 🔧 listener + temp pin refs
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const acListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const tempPinRef = useRef<google.maps.Marker | null>(null);

  const activeSearchTokenRef = useRef<number>(0); // to discard stale results

  const clearSearchMarkers = () => {
    searchMarkersRef.current.forEach((m) => m.setMap(null));
    searchMarkersRef.current = [];
  };

  const renderSavedMarkers = () => {
    if (!mapRef.current) return;

    const currentIds = new Set(savedPlaces.map((p) => p.id));

    // remove deleted
    for (const [id, marker] of savedMarkersRef.current.entries()) {
      if (!currentIds.has(id)) {
        marker.setMap(null);
        savedMarkersRef.current.delete(id);
      }
    }

    // add new
    savedPlaces.forEach((place) => {
      if (!savedMarkersRef.current.has(place.id)) {
        const marker = new google.maps.Marker({
          map: mapRef.current!,
          position: place.location,
          title: place.name,
          icon: { url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
        });

        marker.addListener('click', () => {
          const div = document.createElement('div');
          div.style.maxWidth = '240px';
          div.innerHTML = `
            <div style="font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
              <h3 style="margin:0 0 6px 0;font-size:16px;">${escapeHtml(place.name)}</h3>
              <div style="font-size:13px;color:#444;margin-bottom:6px;">${escapeHtml(place.address)}</div>
              ${place.rating ? `<div style="font-size:13px;margin-bottom:6px;">Rating: ${place.rating}/5</div>` : ''}
              <div style="font-size:12px;color:#777;">Saved: ${new Date(place.savedAt).toLocaleString()}</div>
            </div>
          `;
          infoRef.current!.setContent(div);
          infoRef.current!.open({ map: mapRef.current!, anchor: marker });
        });

        savedMarkersRef.current.set(place.id, marker);
      }
    });
  };

  // Load Maps JS + init map once
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!divRef.current) return;

      const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!key) {
        divRef.current.innerHTML =
          '<div style="padding:12px;color:#b91c1c;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;">Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</div>';
        return;
      }

      // Modern loader API
      setOptions({
        key,
        v: 'weekly',
        libraries: ['places'],
      });

      try {
        await Promise.all([importLibrary('maps'), importLibrary('places')]);
        if (cancelled) return;
      } catch (error) {
        console.error('Google Maps API Error:', error);
        if (divRef.current) {
          divRef.current.innerHTML = `
            <div style="padding:12px;color:#b91c1c;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;">
              <strong>Google Maps Error:</strong><br/>
              ${error instanceof Error ? escapeHtml(error.message) : 'Unknown error'}
            </div>
          `;
        }
        return;
      }

      const map = new google.maps.Map(divRef.current, {
        center,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      mapRef.current = map;
      infoRef.current = new google.maps.InfoWindow();
      placesRef.current = new google.maps.places.PlacesService(map);

      // ✅ do NOT bind the click listener here (it would capture stale newPinMode=false)
      // render existing saved markers
      renderSavedMarkers();
    };

    load();

    return () => {
      cancelled = true;
      // cleanup listeners/markers/info windows
      mapClickListenerRef.current?.remove();
      acListenerRef.current?.remove();
      clearSearchMarkers();
      if (tempPinRef.current) {
        tempPinRef.current.setMap(null);
        tempPinRef.current = null;
      }
      for (const [, marker] of savedMarkersRef.current.entries()) marker.setMap(null);
      savedMarkersRef.current.clear();
      infoRef.current?.close();
      infoRef.current = null;
      placesRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once

  // ✅ Rebind map click listener whenever newPinMode changes
  useEffect(() => {
  const map = mapRef.current;
  if (!map) return;

  // remove previous listener
  mapClickListenerRef.current?.remove();
  mapClickListenerRef.current = null;

  if (!newPinMode) {
    // turning OFF: reset cursor + clear temp marker
    map.setOptions({ draggableCursor: undefined });
    if (tempPinRef.current) {
      tempPinRef.current.setMap(null);
      tempPinRef.current = null;
    }
    return;
  }

  // turning ON: show crosshair + fresh listener
  map.setOptions({ draggableCursor: 'crosshair' });

  mapClickListenerRef.current = map.addListener('click', (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // drop/replace temp marker
    if (tempPinRef.current) tempPinRef.current.setMap(null);
    tempPinRef.current = new google.maps.Marker({
      map,
      position: { lat, lng },
      title: 'Pinned location',
    });

    onSavePlace({
      id: 'custom_' + Date.now(),
      name: 'Custom Location',
      address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
      location: { lat, lng },
      rating: null,
      types: ['custom'],
      savedAt: new Date().toISOString(),
    });
  });

  return () => {
    mapClickListenerRef.current?.remove();
    mapClickListenerRef.current = null;
  };
}, [newPinMode, onSavePlace]);

  // Re-render saved markers when collection changes
  useEffect(() => {
    if (!mapRef.current) return;
    renderSavedMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedPlaces]);

  // Focus/pan when a place/card is chosen
  useEffect(() => {
    if (!mapRef.current || !focusLocation) return;
    mapRef.current.panTo(focusLocation);
    if (focusZoom) mapRef.current.setZoom(focusZoom);
  }, [focusLocation, focusZoom]);

  // Bind Autocomplete to external input (if provided)
  useEffect(() => {
    const map = mapRef.current;
    const inputEl = bindAutocompleteInputRef?.current;
    if (!map || !inputEl || !(google.maps as any)?.places?.Autocomplete) return;

    // Create Autocomplete once per input element
    const ac = new google.maps.places.Autocomplete(inputEl, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry'],
      // types: ['establishment'],
    });

    // Clean up any previous listener
    acListenerRef.current?.remove();

    acListenerRef.current = ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      const loc = place?.geometry?.location;
      if (!loc) return;

      map.panTo(loc);
      map.setZoom(15);

      // Optional: auto-save
      // onSavePlace({ ... })
    });

    return () => {
      acListenerRef.current?.remove();
      acListenerRef.current = null;
    };
  }, [bindAutocompleteInputRef?.current]);

  // Text Search (triggered by searchTrigger) with stale-result guard
  useEffect(() => {
    const map = mapRef.current;
    const svc = placesRef.current;
    const q = searchQuery?.trim();
    if (!map || !svc || !q) return;

    const token = Date.now();
    activeSearchTokenRef.current = token;

    clearSearchMarkers();

    svc.textSearch(
      {
        query: q,
        location: map.getCenter() ?? new google.maps.LatLng(center),
        radius: 5000,
      },
      (results, status) => {
        // Ignore stale responses
        if (activeSearchTokenRef.current !== token) return;

        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
          return;
        }

        const bounds = new google.maps.LatLngBounds();
        let anyBounds = false;

        results.forEach((place) => {
          if (!place.geometry?.location) return;

          const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
          });

          searchMarkersRef.current.push(marker);

          marker.addListener('click', () => {
            const node = buildInfoContent(place, () => {
              onSavePlace({
                id: place.place_id!,
                name: place.name ?? 'Unknown place',
                address: place.formatted_address ?? place.vicinity ?? '',
                location: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng(),
                },
                rating: place.rating ?? null,
                types: place.types,
                savedAt: new Date().toISOString(),
              });
            });

            infoRef.current!.setContent(node);
            infoRef.current!.open({ map, anchor: marker });
          });

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
            anyBounds = true;
          } else if (place.geometry.location) {
            bounds.extend(place.geometry.location);
            anyBounds = true;
          }
        });

        if (anyBounds) {
          map.fitBounds(bounds);
        } else {
          // Fallback: center on the first result if bounds were not extended
          const first = results[0];
          const loc = first.geometry?.location;
          if (loc) {
            map.panTo(loc);
            map.setZoom(14);
          }
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger]); // rerun only when you explicitly trigger

  return <div ref={divRef} style={{ width: '100%', height: '100%' }} />;
}

/* ---------- helpers ---------- */

function buildInfoContent(place: google.maps.places.PlaceResult, onSave: () => void): HTMLDivElement {
  const root = document.createElement('div');
  root.style.maxWidth = '260px';
  root.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial';

  const name = escapeHtml(place.name ?? 'Unknown place');
  const addr = escapeHtml(place.formatted_address ?? place.vicinity ?? '');
  const rating =
    typeof place.rating === 'number' ? `<div style="margin:6px 0;font-size:13px;">Rating: ${place.rating}/5</div>` : '';

  root.innerHTML = `
    <div>
      <div style="font-size:16px;font-weight:600;margin-bottom:6px;">${name}</div>
      <div style="font-size:13px;color:#444;">${addr}</div>
      ${rating}
      <button id="savePlaceBtn"
        style="margin-top:8px;padding:8px 12px;font-size:13px;border:1px solid #2563eb;border-radius:8px;color:#fff;background:#2563eb;cursor:pointer;">
        Save to Favorites
      </button>
    </div>
  `;

  root.querySelector<HTMLButtonElement>('#savePlaceBtn')?.addEventListener('click', onSave);
  return root;
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}


// 'use client';

// import React, { useEffect, useRef } from 'react';
// import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

// export type SavedPlace = {
//   id: string;
//   name: string;
//   address: string;
//   location: { lat: number; lng: number };
//   rating?: number | null;
//   types?: string[];
//   savedAt: string;
// };

// type GoogleMapProps = {
//   center: google.maps.LatLngLiteral;
//   savedPlaces: SavedPlace[];
//   onSavePlace: (place: SavedPlace) => void;
//   focusLocation?: google.maps.LatLngLiteral | null;
//   newPinMode?: boolean;
//   /** Controlled text for manual search (TextSearch) */
//   searchQuery: string;
//   /** Increment to trigger search */
//   searchTrigger: number;
//   /** Map zoom when focusing a specific place */
//   focusZoom?: number;
//   /** (Optional) Pass an external input ref to enable Places Autocomplete */
//   bindAutocompleteInputRef?: React.RefObject<HTMLInputElement>;
// };

// export default function GoogleMap({
//   center,
//   savedPlaces,
//   onSavePlace,
//   focusLocation,
//   newPinMode = false,
//   searchQuery,
//   searchTrigger,
//   focusZoom = 15,
//   bindAutocompleteInputRef,
// }: GoogleMapProps) {
//   const divRef = useRef<HTMLDivElement | null>(null);

//   const mapRef = useRef<google.maps.Map | null>(null);
//   const infoRef = useRef<google.maps.InfoWindow | null>(null);
//   const placesRef = useRef<google.maps.places.PlacesService | null>(null);

//   const searchMarkersRef = useRef<google.maps.Marker[]>([]);
//   const savedMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
//   const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
//   const acListenerRef = useRef<google.maps.MapsEventListener | null>(null);
//   const activeSearchTokenRef = useRef<number>(0); // to discard stale results

//   const clearSearchMarkers = () => {
//     searchMarkersRef.current.forEach((m) => m.setMap(null));
//     searchMarkersRef.current = [];
//   };

//   const renderSavedMarkers = () => {
//     if (!mapRef.current) return;

//     const currentIds = new Set(savedPlaces.map((p) => p.id));

//     // remove deleted
//     for (const [id, marker] of savedMarkersRef.current.entries()) {
//       if (!currentIds.has(id)) {
//         marker.setMap(null);
//         savedMarkersRef.current.delete(id);
//       }
//     }

//     // add new
//     savedPlaces.forEach((place) => {
//       if (!savedMarkersRef.current.has(place.id)) {
//         const marker = new google.maps.Marker({
//           map: mapRef.current!,
//           position: place.location,
//           title: place.name,
//           icon: { url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
//         });

//         marker.addListener('click', () => {
//           const div = document.createElement('div');
//           div.style.maxWidth = '240px';
//           div.innerHTML = `
//             <div style="font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
//               <h3 style="margin:0 0 6px 0;font-size:16px;">${escapeHtml(place.name)}</h3>
//               <div style="font-size:13px;color:#444;margin-bottom:6px;">${escapeHtml(place.address)}</div>
//               ${place.rating ? `<div style="font-size:13px;margin-bottom:6px;">Rating: ${place.rating}/5</div>` : ''}
//               <div style="font-size:12px;color:#777;">Saved: ${new Date(place.savedAt).toLocaleString()}</div>
//             </div>
//           `;
//           infoRef.current!.setContent(div);
//           infoRef.current!.open({ map: mapRef.current!, anchor: marker });
//         });

//         savedMarkersRef.current.set(place.id, marker);
//       }
//     });
//   };

//   // Load Maps JS + init map once
//   useEffect(() => {
//     let cancelled = false;

//     const load = async () => {
//       if (!divRef.current) return;

//       const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
//       if (!key) {
//         divRef.current.innerHTML =
//           '<div style="padding:12px;color:#b91c1c;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;">Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</div>';
//         return;
//       }

//       // Modern loader API
//       setOptions({
//         key,
//         v: 'weekly',
//         libraries: ['places'],
//       });

//       try {
//         await Promise.all([importLibrary('maps'), importLibrary('places')]);
//         if (cancelled) return;
//       } catch (error) {
//         console.error('Google Maps API Error:', error);
//         if (divRef.current) {
//           divRef.current.innerHTML = `
//             <div style="padding:12px;color:#b91c1c;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;">
//               <strong>Google Maps Error:</strong><br/>
//               ${error instanceof Error ? escapeHtml(error.message) : 'Unknown error'}
//             </div>
//           `;
//         }
//         return;
//       }

//       const map = new google.maps.Map(divRef.current, {
//         center,
//         zoom: 13,
//         mapTypeControl: false,
//         streetViewControl: false,
//         fullscreenControl: true,
//       });

//       mapRef.current = map;
//       infoRef.current = new google.maps.InfoWindow();
//       placesRef.current = new google.maps.places.PlacesService(map);

//       // Click to save custom pin
//       mapClickListenerRef.current = map.addListener('click', (e: google.maps.MapMouseEvent) => {
//         if (!newPinMode || !e.latLng) return;
//         const lat = e.latLng.lat();
//         const lng = e.latLng.lng();
//         onSavePlace({
//           id: 'custom_' + Date.now(),
//           name: 'Custom Location',
//           address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
//           location: { lat, lng },
//           rating: null,
//           types: ['custom'],
//           savedAt: new Date().toISOString(),
//         });
//       });

//       renderSavedMarkers();
//     };

//     load();

//     return () => {
//       cancelled = true;
//       mapClickListenerRef.current?.remove();
//       acListenerRef.current?.remove();
//       clearSearchMarkers();
//       for (const [, marker] of savedMarkersRef.current.entries()) marker.setMap(null);
//       savedMarkersRef.current.clear();
//       infoRef.current?.close();
//       infoRef.current = null;
//       placesRef.current = null;
//       mapRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // once

//   // Re-render saved markers when collection changes
//   useEffect(() => {
//     if (!mapRef.current) return;
//     renderSavedMarkers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [savedPlaces]);

//   // Focus/pan when a place/card is chosen
//   useEffect(() => {
//     if (!mapRef.current || !focusLocation) return;
//     mapRef.current.panTo(focusLocation);
//     if (focusZoom) mapRef.current.setZoom(focusZoom);
//   }, [focusLocation, focusZoom]);

//   // (NEW) Bind Autocomplete to external input (if provided)
//   useEffect(() => {
//     const map = mapRef.current;
//     const inputEl = bindAutocompleteInputRef?.current;
//     if (!map || !inputEl || !(google.maps as any)?.places?.Autocomplete) return;

//     // Create Autocomplete once per input element
//     const ac = new google.maps.places.Autocomplete(inputEl, {
//       fields: ['place_id', 'name', 'formatted_address', 'geometry'],
//       // types: ['establishment'], // optionally constrain
//     });

//     // Clean up any previous listener
//     acListenerRef.current?.remove();

//     acListenerRef.current = ac.addListener('place_changed', () => {
//       const place = ac.getPlace();
//       const loc = place?.geometry?.location;
//       if (!loc) return;

//       map.panTo(loc);
//       map.setZoom(15);

//       // (Optional) Save to favorites automatically
//       // onSavePlace({
//       //   id: place.place_id!,
//       //   name: place.name ?? 'Unknown',
//       //   address: place.formatted_address ?? '',
//       //   location: loc.toJSON(),
//       //   rating: null,
//       //   savedAt: new Date().toISOString(),
//       // });
//     });

//     return () => {
//       acListenerRef.current?.remove();
//       acListenerRef.current = null;
//     };
//   }, [bindAutocompleteInputRef?.current]);

//   // Text Search (triggered by searchTrigger) with stale-result guard
//   useEffect(() => {
//     const map = mapRef.current;
//     const svc = placesRef.current;
//     const q = searchQuery?.trim();
//     if (!map || !svc || !q) return;

//     const token = Date.now();
//     activeSearchTokenRef.current = token;

//     clearSearchMarkers();

//     svc.textSearch(
//       {
//         query: q,
//         location: map.getCenter() ?? new google.maps.LatLng(center),
//         radius: 5000,
//       },
//       (results, status) => {
//         // Ignore stale responses
//         if (activeSearchTokenRef.current !== token) return;

//         if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
//           return;
//         }

//         const bounds = new google.maps.LatLngBounds();
//         let anyBounds = false;

//         results.forEach((place) => {
//           if (!place.geometry?.location) return;

//           const marker = new google.maps.Marker({
//             map,
//             position: place.geometry.location,
//             title: place.name,
//           });

//           searchMarkersRef.current.push(marker);

//           marker.addListener('click', () => {
//             const node = buildInfoContent(place, () => {
//               onSavePlace({
//                 id: place.place_id!,
//                 name: place.name ?? 'Unknown place',
//                 address: place.formatted_address ?? place.vicinity ?? '',
//                 location: {
//                   lat: place.geometry!.location!.lat(),
//                   lng: place.geometry!.location!.lng(),
//                 },
//                 rating: place.rating ?? null,
//                 types: place.types,
//                 savedAt: new Date().toISOString(),
//               });
//             });

//             infoRef.current!.setContent(node);
//             infoRef.current!.open({ map, anchor: marker });
//           });

//           if (place.geometry.viewport) {
//             bounds.union(place.geometry.viewport);
//             anyBounds = true;
//           } else if (place.geometry.location) {
//             bounds.extend(place.geometry.location);
//             anyBounds = true;
//           }
//         });

//         if (anyBounds) {
//           map.fitBounds(bounds);
//         } else {
//           // Fallback: center on the first result if bounds were not extended
//           const first = results[0];
//           const loc = first.geometry?.location;
//           if (loc) {
//             map.panTo(loc);
//             map.setZoom(14);
//           }
//         }
//       }
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchTrigger]); // rerun only when you explicitly trigger

//   return <div ref={divRef} style={{ width: '100%', height: '100%' }} />;
// }

// /* ---------- helpers ---------- */

// function buildInfoContent(place: google.maps.places.PlaceResult, onSave: () => void): HTMLDivElement {
//   const root = document.createElement('div');
//   root.style.maxWidth = '260px';
//   root.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial';

//   const name = escapeHtml(place.name ?? 'Unknown place');
//   const addr = escapeHtml(place.formatted_address ?? place.vicinity ?? '');
//   const rating =
//     typeof place.rating === 'number' ? `<div style="margin:6px 0;font-size:13px;">Rating: ${place.rating}/5</div>` : '';

//   root.innerHTML = `
//     <div>
//       <div style="font-size:16px;font-weight:600;margin-bottom:6px;">${name}</div>
//       <div style="font-size:13px;color:#444;">${addr}</div>
//       ${rating}
//       <button id="savePlaceBtn"
//         style="margin-top:8px;padding:8px 12px;font-size:13px;border:1px solid #2563eb;border-radius:8px;color:#fff;background:#2563eb;cursor:pointer;">
//         Save to Favorites
//       </button>
//     </div>
//   `;

//   root.querySelector<HTMLButtonElement>('#savePlaceBtn')?.addEventListener('click', onSave);
//   return root;
// }

// function escapeHtml(s: string) {
//   return s
//     .replaceAll('&', '&amp;')
//     .replaceAll('<', '&lt;')
//     .replaceAll('>', '&gt;')
//     .replaceAll('"', '&quot;')
//     .replaceAll("'", '&#39;');
// }


// 'use client';

// import React, { useEffect, useRef } from 'react';
// import { Loader, setOptions, importLibrary } from '@googlemaps/js-api-loader';

// export type SavedPlace = {
//   id: string;
//   name: string;
//   address: string;
//   location: { lat: number; lng: number };
//   rating?: number | null;
//   types?: string[];
//   savedAt: string;
// };

// type GoogleMapProps = {
//   center: google.maps.LatLngLiteral;
//   savedPlaces: SavedPlace[];
//   onSavePlace: (place: SavedPlace) => void;
//   focusLocation?: google.maps.LatLngLiteral | null;
//   newPinMode?: boolean;
//   searchQuery: string;
//   searchTrigger: number;
//   focusZoom?: number;
// };

// export default function GoogleMap({
//   center,
//   savedPlaces,
//   onSavePlace,
//   focusLocation,
//   newPinMode = false,
//   searchQuery,
//   searchTrigger,
//   focusZoom = 15,
// }: GoogleMapProps) {
//   const divRef = useRef<HTMLDivElement | null>(null);

//   const mapRef = useRef<google.maps.Map | null>(null);
//   const infoRef = useRef<google.maps.InfoWindow | null>(null);
//   const placesRef = useRef<google.maps.places.PlacesService | null>(null);

//   const searchMarkersRef = useRef<google.maps.Marker[]>([]);
//   const savedMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
//   const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

//   const clearSearchMarkers = () => {
//     searchMarkersRef.current.forEach((m) => m.setMap(null));
//     searchMarkersRef.current = [];
//   };

//   const renderSavedMarkers = () => {
//     if (!mapRef.current) return;

//     const currentIds = new Set(savedPlaces.map((p) => p.id));

//     // remove deleted
//     for (const [id, marker] of savedMarkersRef.current.entries()) {
//       if (!currentIds.has(id)) {
//         marker.setMap(null);
//         savedMarkersRef.current.delete(id);
//       }
//     }

//     // add new
//     savedPlaces.forEach((place) => {
//       if (!savedMarkersRef.current.has(place.id)) {
//         const marker = new google.maps.Marker({
//           map: mapRef.current!,
//           position: place.location,
//           title: place.name,
//           icon: { url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
//         });

//         marker.addListener('click', () => {
//           const div = document.createElement('div');
//           div.style.maxWidth = '240px';
//           div.innerHTML = `
//             <div style="font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
//               <h3 style="margin:0 0 6px 0;font-size:16px;">${escapeHtml(place.name)}</h3>
//               <div style="font-size:13px;color:#444;margin-bottom:6px;">${escapeHtml(place.address)}</div>
//               ${place.rating ? `<div style="font-size:13px;margin-bottom:6px;">Rating: ${place.rating}/5</div>` : ''}
//               <div style="font-size:12px;color:#777;">Saved: ${new Date(place.savedAt).toLocaleString()}</div>
//             </div>
//           `;
//           infoRef.current!.setContent(div);
//           infoRef.current!.open({ map: mapRef.current!, anchor: marker });
//         });

//         savedMarkersRef.current.set(place.id, marker);
//       }
//     });
//   };

//   useEffect(() => {
//     let cancelled = false;

//     const load = async () => {
//       if (!divRef.current) return;

//       const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
//       if (!key) {
//         divRef.current.innerHTML =
//           '<div style="padding:12px;color:#b91c1c;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;">Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</div>';
//         return;
//       }

//       console.log('🔑 Using Google Maps API Key:', key.substring(0, 10) + '...');

//       // ✅ NEW API: use `key` and `v` (not `apiKey` / `version`)
//       setOptions({
//         key,              // your Maps key
//         v: 'weekly',      // Maps JS API version
//         libraries: ['places'],
//       });

//       // Load required libraries
//       try {
//         await Promise.all([importLibrary('maps'), importLibrary('places')]);
//         if (cancelled) return;
//       } catch (error) {
//         console.error('❌ Google Maps API Error:', error);
//         if (divRef.current) {
//           divRef.current.innerHTML = `
//             <div style="padding:12px;color:#b91c1c;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;">
//               <strong>Google Maps Error:</strong><br/>
//               ${error instanceof Error ? error.message : 'Unknown error'}<br/>
//               <small>Check console for details</small>
//             </div>
//           `;
//         }
//         return;
//       }

//       const map = new google.maps.Map(divRef.current, {
//         center,
//         zoom: 13,
//         mapTypeControl: false,
//         streetViewControl: false,
//         fullscreenControl: true,
//       });

//       mapRef.current = map;
//       infoRef.current = new google.maps.InfoWindow();
//       placesRef.current = new google.maps.places.PlacesService(map);

//       // Click to save custom pin
//       mapClickListenerRef.current = map.addListener('click', (e: google.maps.MapMouseEvent) => {
//         if (!newPinMode || !e.latLng) return;
//         const lat = e.latLng.lat();
//         onSavePlace({
//           id: 'custom_' + Date.now(),
//           name: 'Custom Location',
//           address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
//           location: { lat, lng },
//           rating: null,
//           types: ['custom'],
//           savedAt: new Date().toISOString(),
//         });
//       });

//       renderSavedMarkers();
//     };

//     load();

//     return () => {
//       cancelled = true;
//       mapClickListenerRef.current?.remove();
//       clearSearchMarkers();
//       for (const [, marker] of savedMarkersRef.current.entries()) marker.setMap(null);
//       savedMarkersRef.current.clear();
//       infoRef.current?.close();
//       infoRef.current = null;
//       placesRef.current = null;
//       mapRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // once

//   useEffect(() => {
//     if (!mapRef.current) return;
//     renderSavedMarkers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [savedPlaces]);

//   useEffect(() => {
//     if (!mapRef.current || !focusLocation) return;
//     mapRef.current.panTo(focusLocation);
//     if (focusZoom) mapRef.current.setZoom(focusZoom);
//   }, [focusLocation, focusZoom]);

//   useEffect(() => {
//     if (!mapRef.current || !placesRef.current) return;
//     if (!searchQuery?.trim()) return;

//     clearSearchMarkers();

//     placesRef.current.textSearch(
//       {
//         query: searchQuery.trim(),
//         location: mapRef.current.getCenter() ?? new google.maps.LatLng(center),
//         radius: 5000,
//       },
//       (results, status) => {
//         if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) return;

//         const bounds = new google.maps.LatLngBounds();

//         results.forEach((place) => {
//           if (!place.geometry?.location) return;

//           const marker = new google.maps.Marker({
//             map: mapRef.current!,
//             position: place.geometry.location,
//             title: place.name,
//           });

//           searchMarkersRef.current.push(marker);

//           marker.addListener('click', () => {
//             const node = buildInfoContent(place, () => {
//               onSavePlace({
//                 id: place.place_id!,
//                 name: place.name ?? 'Unknown place',
//                 address: place.formatted_address ?? place.vicinity ?? '',
//                 location: {
//                   lat: place.geometry!.location!.lat(),
//                   lng: place.geometry!.location!.lng(),
//                 },
//                 rating: place.rating ?? null,
//                 types: place.types,
//                 savedAt: new Date().toISOString(),
//               });
//             });

//             infoRef.current!.setContent(node);
//             infoRef.current!.open({ map: mapRef.current!, anchor: marker });
//           });

//           if (place.geometry.viewport) {
//             bounds.union(place.geometry.viewport);
//           } else if (place.geometry.location) {
//             bounds.extend(place.geometry.location);
//           }
//         });

//         mapRef.current!.fitBounds(bounds);
//       }
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchTrigger]);

//   return <div ref={divRef} style={{ width: '100%', height: '100%' }} />;
// }

// function buildInfoContent(place: google.maps.places.PlaceResult, onSave: () => void): HTMLDivElement {
//   const root = document.createElement('div');
//   root.style.maxWidth = '260px';
//   root.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial';

//   const name = escapeHtml(place.name ?? 'Unknown place');
//   const addr = escapeHtml(place.formatted_address ?? place.vicinity ?? '');
//   const rating = typeof place.rating === 'number' ? `<div style="margin:6px 0;font-size:13px;">Rating: ${place.rating}/5</div>` : '';

//   root.innerHTML = `
//     <div>
//       <div style="font-size:16px;font-weight:600;margin-bottom:6px;">${name}</div>
//       <div style="font-size:13px;color:#444;">${addr}</div>
//       ${rating}
//       <button id="savePlaceBtn"
//         style="margin-top:8px;padding:8px 12px;font-size:13px;border:1px solid #2563eb;border-radius:8px;color:#fff;background:#2563eb;cursor:pointer;">
//         Save to Favorites
//       </button>
//     </div>
//   `;

//   root.querySelector<HTMLButtonElement>('#savePlaceBtn')?.addEventListener('click', onSave);
//   return root;
// }

// function escapeHtml(s: string) {
//   return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
// }
