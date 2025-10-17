import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Trash2, MapPin, User, Menu, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

const MapEvents = ({ onMapClick, newPinMode }) => {
  useMapEvents({
    click: (e) => {
      if (newPinMode) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};
const CityQuokkaApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pins, setPins] = useState([
    { id: 1, lat: -33.8587, lng: 151.2093, tag: 'Restaurant', location: 'Darling St', text: 'Great Italian food' },
    { id: 2, lat: -33.8708, lng: 151.2073, tag: 'Coffee', location: 'George St', text: 'Best coffee in town' },
    { id: 3, lat: -33.8731, lng: 151.2110, tag: 'Park', location: 'Hyde Park', text: 'Perfect for jogging' }
  ]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [newPinMode, setNewPinMode] = useState(false);
  const [tags, setTags] = useState([
    { name: 'Restaurant', pins: [1] },
    { name: 'Coffee', pins: [2] },
    { name: 'Park', pins: [3] }
  ]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState({});
  const mapRef = useRef(null);

  const handleMapClick = (latlng) => {
    if (newPinMode) {
      const newPin = {
        id: Date.now(),
        lat: latlng.lat,
        lng: latlng.lng,
        tag: 'New Location',
        location: 'Click to edit',
        text: 'Add description...'
      };
      setPins([...pins, newPin]);
      setSelectedPin(newPin);
      setNewPinMode(false);
    }
  };

  const deletePin = (pinId) => {
    setPins(pins.filter(pin => pin.id !== pinId));
    setSelectedPin(null);
  };

  const updatePin = (pinId, updates) => {
    setPins(pins.map(pin => 
      pin.id === pinId ? { ...pin, ...updates } : pin
    ));
  };

  // Add new tag
  const handleAddTag = () => {
    const newTagName = prompt('Enter new tag name:');
    if (newTagName && !tags.find(t => t.name === newTagName)) {
      setTags([...tags, { name: newTagName, pins: [] }]);
    }
  };

  // Group pins by tag
  const pinsByTag = tags.map(tag => ({
    ...tag,
    pinDetails: pins.filter(pin => pin.tag === tag.name)
  }));

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Left Sidebar */}
    <div className={`${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-80 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out flex flex-col`}>        
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <User className="w-8 h-8 p-1 bg-gray-800 text-white rounded-full" />
            </div>
          </div>
          <div className="bg-green-500 text-white px-4 py-2 rounded-full text-center font-semibold mb-4">
            My Sydney
          </div>
          <div className="flex space-x-2 mb-4">
            <button 
              onClick={() => setNewPinMode(!newPinMode)}
              className={`p-2 rounded-full ${newPinMode ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              title="Add new pin"
            >
              <Plus className="w-5 h-5" style={{ color: newPinMode ? '#fff' : '#22c55e' }} /> {/* Green for add */}
            </button>
            <button 
              onClick={() => setSelectedPin(null)}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
              title="Clear selection"
            >
              <Trash2 className="w-5 h-5" style={{ color: '#ef4444' }} /> {/* Red for delete */}
            </button>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Tags Dropdown */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg">Tags</span>
              <button
                onClick={handleAddTag}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                title="Add new tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {pinsByTag.map(tag => (
              <div key={tag.name} className="mb-2">
                <div
                  className="bg-orange-400 text-white px-4 py-2 rounded-lg flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setTagDropdownOpen(prev => ({
                      ...prev,
                      [tag.name]: !prev[tag.name]
                    }))
                  }
                >
                  <span className="font-semibold">{tag.name}</span>
                  <Plus className={`w-4 h-4 transition-transform ${tagDropdownOpen[tag.name] ? 'rotate-45' : ''}`} />
                </div>
                {tagDropdownOpen[tag.name] && (
                  <div className="bg-white border rounded-lg mt-1 p-2 space-y-2">
                    {tag.pinDetails.length === 0 ? (
                      <div className="text-gray-400 text-sm">No locations</div>
                    ) : (
                      tag.pinDetails.map(pin => (
                        <div key={pin.id} className="p-2 rounded hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedPin(pin)}>
                          <div className="font-medium text-sm">{pin.location}</div>
                          <div className="text-xs text-gray-600">{pin.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Pin Details */}
            {selectedPin && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Pin Details</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={selectedPin.tag}
                    onChange={(e) => updatePin(selectedPin.id, { tag: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Tag"
                  />
                  <input
                    type="text"
                    value={selectedPin.location}
                    onChange={(e) => updatePin(selectedPin.id, { location: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Location"
                  />
                  <textarea
                    value={selectedPin.text}
                    onChange={(e) => updatePin(selectedPin.id, { text: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Description"
                    rows="3"
                  />
                  <button
                    onClick={() => deletePin(selectedPin.id)}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    Delete Pin
                  </button>
                </div>
              </div>
            )}

            {/* Pins List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Saved Pins</h3>
              {pins.map(pin => (
                <div 
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    selectedPin?.id === pin.id ? 'bg-blue-50 border-blue-300' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-sm">{pin.tag}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{pin.location}</p>
                  <p className="text-xs text-gray-500 truncate">{pin.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow-sm p-4 flex items-center space-x-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">City</span>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🐨</span>
            </div>
            <span className="text-2xl font-bold">QUOKKA</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search Location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {newPinMode && (
            <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg z-20">
              Click on the map to add a new pin
            </div>
          )}
          
          <MapContainer
            center={[-33.8688, 151.2093]} // Sydney coordinates
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapEvents onMapClick={handleMapClick} newPinMode={newPinMode} />
            
            {pins.map(pin => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                eventHandlers={{
                  click: () => setSelectedPin(pin)
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold text-blue-600 mb-1">{pin.tag}</div>
                    <div className="font-medium mb-1">{pin.location}</div>
                    <div className="text-gray-600">{pin.text}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>


      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default CityQuokkaApp;