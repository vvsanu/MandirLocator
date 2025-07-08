import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngBounds, divIcon } from 'leaflet';
import type { TempleWithDistance } from '@shared/schema';
import bapsLogo from '@assets/image_1751840390730.png';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TempleMapProps {
  temples: TempleWithDistance[];
  center: { lat: number; lng: number };
  onTempleSelect?: (temple: TempleWithDistance) => void;
  selectedTemple?: TempleWithDistance | null;
}

// Component to fit map bounds to show all temples
function MapBounds({ temples, center }: { temples: TempleWithDistance[]; center: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (temples.length > 0) {
      // Get coordinates for temples that have location data
      const templeCoords = temples
        .map(temple => getTempleCoordinates(temple))
        .filter(coords => coords !== null);

      if (templeCoords.length > 0) {
        // Include user location and temple locations
        const allCoords = [center, ...templeCoords];
        const bounds = new LatLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    } else {
      // Just center on user location if no temples
      map.setView([center.lat, center.lng], 10);
    }
  }, [temples, center, map]);

  return null;
}

// Get coordinates for a temple based on city/address
function getTempleCoordinates(temple: TempleWithDistance): { lat: number; lng: number } | null {
  // Coordinate mapping for major cities where BAPS temples are located
  const coordinates: { [key: string]: { lat: number, lng: number } } = {
    "Agawam": { lat: 42.0695, lng: -72.6148 },
    "Albany": { lat: 31.5804, lng: -84.1557 },
    "Allentown": { lat: 40.6023, lng: -75.4714 },
    "Atlanta": { lat: 33.7490, lng: -84.3880 },
    "Austin": { lat: 30.2672, lng: -97.7431 },
    "Beaumont": { lat: 30.0804, lng: -94.1266 },
    "Birmingham": { lat: 33.5207, lng: -86.8025 },
    "Boston": { lat: 42.3601, lng: -71.0589 },
    "Calgary": { lat: 51.0447, lng: -114.0719 },
    "Charlotte": { lat: 35.2271, lng: -80.8431 },
    "Chicago": { lat: 41.8781, lng: -87.6298 },
    "Cincinnati": { lat: 39.1612, lng: -84.4569 },
    "Cleveland": { lat: 41.4993, lng: -81.6944 },
    "Columbus": { lat: 39.9612, lng: -82.9988 },
    "Dallas": { lat: 32.7767, lng: -96.7970 },
    "Denver": { lat: 39.7392, lng: -104.9903 },
    "Detroit": { lat: 42.3314, lng: -83.0458 },
    "Edison": { lat: 40.5187, lng: -74.4121 },
    "Fresno": { lat: 36.7378, lng: -119.7871 },
    "Houston": { lat: 29.7604, lng: -95.3698 },
    "Indianapolis": { lat: 39.7684, lng: -86.1581 },
    "Jacksonville": { lat: 30.3322, lng: -81.6557 },
    "Kansas City": { lat: 39.0997, lng: -94.5786 },
    "Las Vegas": { lat: 36.1699, lng: -115.1398 },
    "Los Angeles": { lat: 34.0522, lng: -118.2437 },
    "Memphis": { lat: 35.1495, lng: -90.0490 },
    "Miami": { lat: 25.7617, lng: -80.1918 },
    "Minneapolis": { lat: 44.9778, lng: -93.2650 },
    "Nashville": { lat: 36.1627, lng: -86.7816 },
    "New York": { lat: 40.7128, lng: -74.0060 },
    "Orlando": { lat: 28.5383, lng: -81.3792 },
    "Philadelphia": { lat: 39.9526, lng: -75.1652 },
    "Phoenix": { lat: 33.4484, lng: -112.0740 },
    "Pittsburgh": { lat: 40.4406, lng: -79.9959 },
    "Portland": { lat: 45.5152, lng: -122.6784 },
    "Raleigh": { lat: 35.7796, lng: -78.6382 },
    "Sacramento": { lat: 38.5816, lng: -121.4944 },
    "San Antonio": { lat: 29.4241, lng: -98.4936 },
    "San Francisco": { lat: 37.7749, lng: -122.4194 },
    "San Jose": { lat: 37.3382, lng: -121.8863 },
    "Seattle": { lat: 47.6062, lng: -122.3321 },
    "Tampa": { lat: 27.9506, lng: -82.4572 },
    "Toronto": { lat: 43.6532, lng: -79.3832 },
    "Tucson": { lat: 32.2226, lng: -110.9747 },
    "Washington": { lat: 38.9072, lng: -77.0369 },
  };

  // Try to match the city name
  const cityKey = Object.keys(coordinates).find(key => 
    temple.city.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(temple.city.toLowerCase())
  );

  return cityKey ? coordinates[cityKey] : null;
}

// Create temple icon with BAPS logo
function createTempleIcon() {
  return divIcon({
    html: `<div style="
      background-color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid #FF6B35;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    ">
      <img src="${bapsLogo}" style="
        width: 20px;
        height: 20px;
        object-fit: contain;
      " alt="BAPS" />
    </div>`,
    className: 'custom-temple-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

// User location marker
const userIcon = divIcon({
  html: `<div style="
    background-color: #1E3A8A;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    color: white;
  ">📍</div>`,
  className: 'custom-user-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

export default function TempleMap({ temples, center, onTempleSelect, selectedTemple }: TempleMapProps) {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        touchZoom={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds temples={temples} center={center} />

        {/* User location marker */}
        <Marker position={[center.lat, center.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
            </div>
          </Popup>
        </Marker>

        {/* Temple markers */}
        {temples.map((temple) => {
          const coords = getTempleCoordinates(temple);
          if (!coords) return null;

          return (
            <Marker
              key={temple.id}
              position={[coords.lat, coords.lng]}
              icon={createTempleIcon()}
              eventHandlers={{
                click: () => onTempleSelect?.(temple),
              }}
            >
              <Popup>
                <div className="max-w-xs">
                  <h3 className="font-semibold text-deep-blue mb-2">{temple.city}</h3>
                  <p className="text-sm text-gray-600 mb-2">{temple.address}</p>
                  {temple.phone && (
                    <p className="text-sm text-gray-600 mb-1">
                      📞 {temple.phone}
                    </p>
                  )}
                  <p className="text-sm text-saffron font-medium">
                    {temple.distance} miles away
                  </p>
                  <button
                    onClick={() => onTempleSelect?.(temple)}
                    className="mt-2 px-3 py-1 bg-saffron text-white text-xs rounded hover:bg-orange-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}