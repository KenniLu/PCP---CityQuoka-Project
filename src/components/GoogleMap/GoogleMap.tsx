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
  searchQuery: string;
  searchTrigger: number;
  focusZoom?: number;
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
}: GoogleMapProps) {
  const divRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const placesRef = useRef<google.maps.places.PlacesService | null>(null);

  const searchMarkersRef = useRef<google.maps.Marker[]>([]);
  const savedMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

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

      // ✅ NEW API: use `key` and `v` (not `apiKey` / `version`)
      setOptions({
        key,              // your Maps key
        v: 'weekly',      // Maps JS API version
        libraries: ['places'],
      });

      // Load required libraries
      await Promise.all([importLibrary('maps'), importLibrary('places')]);
      if (cancelled) return;

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

      // Click to save custom pin
      mapClickListenerRef.current = map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!newPinMode || !e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
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

      renderSavedMarkers();
    };

    load();

    return () => {
      cancelled = true;
      mapClickListenerRef.current?.remove();
      clearSearchMarkers();
      for (const [, marker] of savedMarkersRef.current.entries()) marker.setMap(null);
      savedMarkersRef.current.clear();
      infoRef.current?.close();
      infoRef.current = null;
      placesRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once

  useEffect(() => {
    if (!mapRef.current) return;
    renderSavedMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedPlaces]);

  useEffect(() => {
    if (!mapRef.current || !focusLocation) return;
    mapRef.current.panTo(focusLocation);
    if (focusZoom) mapRef.current.setZoom(focusZoom);
  }, [focusLocation, focusZoom]);

  useEffect(() => {
    if (!mapRef.current || !placesRef.current) return;
    if (!searchQuery?.trim()) return;

    clearSearchMarkers();

    placesRef.current.textSearch(
      {
        query: searchQuery.trim(),
        location: mapRef.current.getCenter() ?? new google.maps.LatLng(center),
        radius: 5000,
      },
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) return;

        const bounds = new google.maps.LatLngBounds();

        results.forEach((place) => {
          if (!place.geometry?.location) return;

          const marker = new google.maps.Marker({
            map: mapRef.current!,
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
            infoRef.current!.open({ map: mapRef.current!, anchor: marker });
          });

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else if (place.geometry.location) {
            bounds.extend(place.geometry.location);
          }
        });

        mapRef.current!.fitBounds(bounds);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger]);

  return <div ref={divRef} style={{ width: '100%', height: '100%' }} />;
}

function buildInfoContent(place: google.maps.places.PlaceResult, onSave: () => void): HTMLDivElement {
  const root = document.createElement('div');
  root.style.maxWidth = '260px';
  root.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial';

  const name = escapeHtml(place.name ?? 'Unknown place');
  const addr = escapeHtml(place.formatted_address ?? place.vicinity ?? '');
  const rating = typeof place.rating === 'number' ? `<div style="margin:6px 0;font-size:13px;">Rating: ${place.rating}/5</div>` : '';

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
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
