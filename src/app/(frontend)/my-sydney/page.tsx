'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  MapPin,
  Menu,
  X,
  FolderPlus,
  Folder as FolderIcon,
  CheckCircle2,
} from 'lucide-react';
import GoogleMap, { SavedPlace } from '@/components/GoogleMap/GoogleMap';
import AppHeader from '@/components/AppHeader'; // ✅ added

type Folder = {
  id: string;
  name: string;
  placeIds: string[];
};

export default function MySydneyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [newPinMode, setNewPinMode] = useState(false);
  const [focusLocation, setFocusLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const defaultCenter = useMemo(() => ({ lat: -33.8688, lng: 151.2093 }), []);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/mysydney');
        if (!res.ok) throw new Error('Failed to load data');
        const json = await res.json();
        setFolders(json.folders || []);
        setSavedPlaces(json.places || []);
        if (json.folders?.length > 0) setActiveFolderId(json.folders[0].id);
      } catch (err) {
        console.error('Error loading My Sydney data:', err);
      }
    }
    loadData();
  }, []);

  // Helpers
  const ensureActiveFolder = () => {
    if (activeFolderId && folders.some(f => f.id === activeFolderId)) return activeFolderId;
    if (folders.length === 0) {
      const f: Folder = { id: 'folder_' + Date.now(), name: 'Favorites', placeIds: [] };
      setFolders([f]);
      setActiveFolderId(f.id);
      return f.id;
    }
    setActiveFolderId(folders[0].id);
    return folders[0].id;
  };

  const runSearch = () => {
    if (!searchQuery.trim()) return;
    setSearchTrigger(x => x + 1);
  };

  const placesById = new Map(savedPlaces.map(p => [p.id, p]));
  const activeFolder = folders.find(f => f.id === activeFolderId) || null;
  const activePlaces =
    activeFolder?.placeIds.map(pid => placesById.get(pid)).filter(Boolean) as SavedPlace[] || [];

  // Place actions
  const onSavePlace = async (place: SavedPlace) => {
    try {
      const folderId = ensureActiveFolder();
      const res = await fetch('/api/mysydney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addPlace',
          name: place.name,
          address: place.address,
          rating: place.rating,
          location: place.location,
          folderId,
        }),
      });
      const newPlace = await res.json();
      setSavedPlaces(prev => [...prev, newPlace]);
      setFolders(prev =>
        prev.map(f =>
          f.id === folderId ? { ...f, placeIds: [...new Set([...f.placeIds, newPlace.id])] } : f
        )
      );
    } catch (err) {
      console.error('Error saving place:', err);
    }
  };

  const showOnMap = (place: SavedPlace) => {
    setFocusLocation(place.location);
  };

  const removePlaceEverywhere = (placeId: string) => {
    setSavedPlaces(prev => prev.filter(p => p.id !== placeId));
    setFolders(prev => prev.map(f => ({ ...f, placeIds: f.placeIds.filter(pid => pid !== placeId) })));
  };

  const movePlaceToFolder = (placeId: string, targetFolderId: string) => {
    setFolders(prev => {
      const cleared = prev.map(f => ({ ...f, placeIds: f.placeIds.filter(pid => pid !== placeId) }));
      return cleared.map(f => (f.id === targetFolderId ? { ...f, placeIds: [...f.placeIds, placeId] } : f));
    });
  };

  // Folder actions
  const addFolder = async () => {
    const name = prompt('Folder name:');
    if (!name) return;
    try {
      const res = await fetch('/api/mysydney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addFolder', name }),
      });
      const folder = await res.json();
      setFolders(prev => [...prev, folder]);
      setActiveFolderId(folder.id);
    } catch (err) {
      console.error('Error adding folder:', err);
    }
  };

  const deleteFolder = (folderId: string) => {
    setFolders(prev => {
      const target = prev.find(f => f.id === folderId);
      const remaining = prev.filter(f => f.id !== folderId);
      if (target) {
        const stillUsed = new Set<string>(remaining.flatMap(f => f.placeIds));
        const toDeletePlaces = target.placeIds.filter(pid => !stillUsed.has(pid));
        if (toDeletePlaces.length) {
          setSavedPlaces(prevPlaces => prevPlaces.filter(p => !toDeletePlaces.includes(p.id)));
        }
      }
      if (activeFolderId === folderId) {
        if (remaining.length > 0) setActiveFolderId(remaining[0].id);
        else setActiveFolderId(null);
      }
      return remaining;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* ✅ Global App Header */}
      <AppHeader />

      {/* Local Header */}
      <div className="shrink-0 bg-white border-b">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center gap-6 justify-between">
          <div className="text-2xl font-bold text-gray-800">My Sydney</div>

          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search location (e.g., cafe near me)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 bg-white"
            />
            <button
              onClick={runSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="flex-1 min-h-0">
        <div className="mx-auto max-w-[1400px] h-full px-6 py-6 grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside
            className={`col-span-12 lg:col-span-4 xl:col-span-3 bg-white rounded-2xl shadow border p-6 ${
              isMenuOpen ? '' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setNewPinMode(!newPinMode)}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  newPinMode ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Plus className="w-4 h-4" /> New Pin
              </button>

              <button
                onClick={addFolder}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
              >
                <FolderPlus className="w-4 h-4" /> New Folder
              </button>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Tip: enable <span className="font-medium">New Pin</span> and click anywhere on the map to save a custom location.
            </p>

            <div className="space-y-5">
              {folders.length === 0 ? (
                <div className="text-sm text-gray-500 border rounded-lg p-4">
                  No folders yet. Click <span className="font-semibold">New Folder</span> to start organising places.
                </div>
              ) : (
                folders.map(folder => {
                  const isActive = activeFolderId === folder.id;
                  const places = folder.placeIds
                    .map(pid => placesById.get(pid))
                    .filter(Boolean) as SavedPlace[];

                  return (
                    <div key={folder.id} className={`rounded-2xl border ${isActive ? 'border-blue-300' : 'border-gray-200'} bg-white`}>
                      <div
                        className="flex items-center justify-between p-4 rounded-t-2xl bg-gray-50 cursor-pointer"
                        onClick={() => setActiveFolderId(folder.id)}
                      >
                        <div className="flex items-center gap-2">
                          <FolderIcon className="w-4 h-4" />
                          <div className="font-semibold">{folder.name}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isActive && (
                            <span className="inline-flex text-blue-600 text-xs font-medium items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Active
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{places.length}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete folder "${folder.name}"?`)) deleteFolder(folder.id);
                            }}
                            className="p-2 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        {places.length === 0 && (
                          <div className="text-sm text-gray-500">No places in this folder yet.</div>
                        )}

                        {places.map(p => (
                          <div key={p.id} className="p-4 rounded-xl border bg-white">
                            <div className="flex items-center space-x-2 mb-1">
                              <MapPin className="w-4 h-4 text-red-500" />
                              <span className="font-medium text-sm">{p.name}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{p.address}</p>
                            {!!p.rating && <p className="text-xs text-gray-500">Rating: {p.rating}/5</p>}

                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                className="px-3 py-1.5 text-xs rounded-full bg-gray-200 hover:bg-gray-300"
                                onClick={() => showOnMap(p)}
                              >
                                Show on Map
                              </button>

                              {folders.length > 1 && (
                                <select
                                  value={folder.id}
                                  onChange={(e) => movePlaceToFolder(p.id, e.target.value)}
                                  className="text-xs border rounded-full px-3 py-1.5"
                                >
                                  {folders.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                  ))}
                                </select>
                              )}

                              <button
                                className="px-3 py-1.5 text-xs rounded-full bg-red-500 text-white hover:bg-red-600"
                                onClick={() => removePlaceEverywhere(p.id)}
                              >
                                Remove Place
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Map section */}
          <section className="col-span-12 lg:col-span-8 xl:col-span-9 rounded-2xl overflow-hidden bg-white border shadow min-h-0">
            <GoogleMap
              center={defaultCenter}
              savedPlaces={savedPlaces}
              onSavePlace={onSavePlace}
              focusLocation={focusLocation}
              newPinMode={newPinMode}
              searchQuery={searchQuery}
              searchTrigger={searchTrigger}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
