import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import type { Restaurant } from '../data/restaurants';
import { Phone, X, Search, Loader2, MapPin, Car, Footprints } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Props {
  restaurants: Restaurant[];
}

// Custom hook to handle map clicks for setting origin
const MapClickHandler = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Component to handle routing
const RoutingMachine = ({ 
  origin, 
  destination, 
  onRouteFound 
}: { 
  origin: L.LatLng | null; 
  destination: L.LatLng | null;
  onRouteFound: (summary: { distance: number; time: number }) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !origin || !destination) return;

    // @ts-ignore
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(origin.lat, origin.lng),
        L.latLng(destination.lat, destination.lng)
      ],
      lineOptions: {
        styles: [{ color: '#aa3bff', weight: 6 }]
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
      language: 'es'
    } as any).addTo(map);

    routingControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      onRouteFound({
        distance: summary.totalDistance,
        time: summary.totalTime
      });
    });

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, origin, destination]);

  return null;
};

// Component to help with map interactions like panning
const MapController = ({ origin }: { origin: L.LatLng | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (origin) {
      map.flyTo(origin, 15);
    }
  }, [origin, map]);
  
  return null;
};

export const MapView: React.FC<Props> = ({ restaurants }) => {
  const [origin, setOrigin] = useState<L.LatLng | null>(null);
  const [destination, setDestination] = useState<L.LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [routeSummary, setRouteSummary] = useState<{
    distance: number;
    drivingTime: number;
    walkingTime: number | null;
  } | null>(null);
  
  const santiagoCenter: [number, number] = [40.7306, -73.9352]; // New York Center

  const handleMarkerClick = (restaurant: Restaurant) => {
    setDestination(L.latLng(restaurant.lat, restaurant.lng));
    setRouteSummary(null);
  };

  const handleRouteFound = async (summary: { distance: number; time: number }) => {
    setRouteSummary({
      distance: summary.distance,
      drivingTime: summary.time,
      walkingTime: null
    });

    if (origin && destination) {
      try {
        // Using OpenStreetMap Germany's foot routing service which is more reliable for pedestrian profiles
        const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          let walkDuration = data.routes[0].duration;
          
          // Heuristic check: Average walking speed is ~1.4 m/s (5 km/h).
          // If the API returns a duration that implies a speed > 10 km/h, 
          // it's likely returning driving time. We apply a fallback.
          const impliedSpeed = summary.distance / walkDuration; // m/s
          if (impliedSpeed > 2.8) { // > 10 km/h is not walking
            walkDuration = summary.distance / 1.38; // Fallback to 5 km/h
          }

          setRouteSummary(prev => {
            if (!prev) return null;
            return {
              ...prev,
              walkingTime: walkDuration
            };
          });
        } else {
          // API Fallback: distance / 1.38 m/s (5 km/h)
          setRouteSummary(prev => prev ? { ...prev, walkingTime: summary.distance / 1.38 } : null);
        }
      } catch (e) {
        console.error("Error fetching walking time:", e);
        // Fallback on error
        setRouteSummary(prev => prev ? { ...prev, walkingTime: summary.distance / 1.38 } : null);
      }
    }
  };

  const handleMapClick = (latlng: L.LatLng) => {
    setOrigin(latlng);
    setSearchError(null);
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setSearchQuery('');
    setSearchError(null);
    setRouteSummary(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const fullQuery = `${searchQuery}, Santiago, Chile`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setOrigin(L.latLng(parseFloat(lat), parseFloat(lon)));
      } else {
        setSearchError('No se encontró la dirección.');
      }
    } catch (error) {
      setSearchError('Error al buscar.');
    } finally {
      setIsSearching(false);
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const originIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const gfIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const partialGfIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="h-[calc(100vh-140px)] w-full relative">
      <MapContainer 
        center={santiagoCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        <MapController origin={origin} />
        
        {origin && (
          <Marker position={origin} icon={originIcon}>
            <Popup>Tu ubicación seleccionada</Popup>
          </Marker>
        )}

        {restaurants.map((restaurant) => (
          <Marker 
            key={restaurant.id} 
            position={[restaurant.lat, restaurant.lng]}
            icon={restaurant.isFullGlutenFree ? gfIcon : partialGfIcon}
            eventHandlers={{
              click: () => handleMarkerClick(restaurant),
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-lg m-0">{restaurant.name}</h3>
                <p className="text-xs font-semibold mt-1 mb-3">
                  {restaurant.isFullGlutenFree ? (
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">100% Sin Gluten</span>
                  ) : (
                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Opciones Sin Gluten</span>
                  )}
                </p>
                <a 
                  href={`tel:${restaurant.phone}`}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  <Phone size={14} /> Llamar: {restaurant.phone}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        <RoutingMachine origin={origin} destination={destination} onRouteFound={handleRouteFound} />
      </MapContainer>

      {/* Top Controls: Search and Status */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-3 w-full max-w-md px-4">
        {/* Search Bar */}
        {!origin && (
          <form 
            onSubmit={handleSearch}
            className="w-full flex items-center bg-white dark:bg-zinc-900 rounded-full shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden pr-1"
          >
            <div className="pl-4 text-zinc-400">
              <MapPin size={18} />
            </div>
            <input 
              type="text"
              placeholder="Ingresa calle y número..."
              className="flex-1 py-3 px-3 text-sm bg-transparent outline-none text-zinc-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-brand text-white p-2 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </form>
        )}

        {/* Status Message */}
        <div className="flex items-center gap-2">
          <div className={`backdrop-blur px-4 py-2 rounded-full shadow-lg border font-medium bg-white/90 ${!origin ? 'border-brand/20 text-brand' : (!destination ? 'border-green-500/20 text-green-700' : 'border-brand/20 text-brand')}`}>
            {!origin ? 'O haz clic en el mapa' : (!destination ? 'Ahora selecciona un restaurante' : 'Ruta calculada')}
          </div>
          {origin && (
            <button 
              onClick={handleReset}
              className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center"
              title="Quitar mi ubicación"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {searchError && (
          <div className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full border border-red-200 shadow-sm animate-pulse">
            {searchError}
          </div>
        )}
      </div>

      {/* Travel Time Info Panel (Bottom Right) */}
      {routeSummary && (
        <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-brand/20 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 min-w-[180px]">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Resumen de viaje</span>
            <span className="text-sm font-black text-brand">{formatDistance(routeSummary.distance)}</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Car size={16} />
                <span className="text-xs font-medium">Auto</span>
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">{formatTime(routeSummary.drivingTime)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Footprints size={16} />
                <span className="text-xs font-medium">Caminando</span>
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">
                {routeSummary.walkingTime ? formatTime(routeSummary.walkingTime) : '...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 dark:bg-zinc-900/95 backdrop-blur p-3 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-sm">
        <h4 className="font-bold mb-2 text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-1">Leyenda</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            <span className="text-zinc-700 dark:text-zinc-300">100% Sin Gluten</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
            <span className="text-zinc-700 dark:text-zinc-300">Opciones Sin Gluten</span>
          </div>
          <div className="flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-1 mt-1">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
            <span className="text-zinc-700 dark:text-zinc-300 italic text-xs">Tu ubicación</span>
          </div>
        </div>
      </div>
    </div>
  );
};
