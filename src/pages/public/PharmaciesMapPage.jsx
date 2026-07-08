import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { usePharmacies } from '../../hooks/usePharmacies';
import { useSearchParams } from 'react-router-dom';
import PharmacieCard from '../../components/molecules/PharmacieCard';
import Spinner from '../../components/atoms/Spinner';
import Button from '../../components/atoms/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, X, Car, Footprints } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DAKAR_CENTER = [14.6928, -17.4467];

function FlyToMarker({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom || 16, { duration: 1 });
    }
  }, [position, zoom, map]);
  return null;
}

function FitRoute({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 1) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
}

function UserMarker({ position }) {
  if (!position) return null;
  const icon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;background:#1A6FBF;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.3)"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
  return <Marker position={position} icon={icon}><Popup>Votre position</Popup></Marker>;
}

function RouteInfoOverlay({ routeInfo, selectedMode, onSelectMode, onStart, onClose, tracking, onStop }) {
  if (!routeInfo) return null;
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-noir text-sm">Itinéraire</span>
        <button onClick={onClose} className="p-1 hover:bg-gris-clair rounded cursor-pointer">
          <X className="w-4 h-4 text-gris" />
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onSelectMode('driving')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm cursor-pointer transition-colors ${selectedMode === 'driving' ? 'bg-bleu text-white' : 'bg-gris-clair text-noir hover:bg-gray-200'}`}
        >
          <Car className="w-4 h-4" />
          <span>{formatDuration(routeInfo.driving?.duration)}</span>
        </button>
        <button
          onClick={() => onSelectMode('foot')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm cursor-pointer transition-colors ${selectedMode === 'foot' ? 'bg-bleu text-white' : 'bg-gris-clair text-noir hover:bg-gray-200'}`}
        >
          <Footprints className="w-4 h-4" />
          <span>{formatDuration(routeInfo.foot?.duration)}</span>
        </button>
      </div>

      <p className="text-xs text-gris text-center mb-3">
        {formatDistance(routeInfo[selectedMode]?.distance)}
      </p>

      {!tracking ? (
        <Button size="sm" className="w-full" onClick={onStart}>
          <Navigation className="w-3.5 h-3.5" />
          Suivre l'itinéraire
        </Button>
      ) : (
        <Button size="sm" variant="danger" className="w-full" onClick={onStop}>
          Arrêter le suivi
        </Button>
      )}
    </div>
  );
}

function formatDuration(seconds) {
  if (!seconds) return '...';
  if (seconds < 60) return '< 1 min';
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return `${h}h ${m}min`;
}

function formatDistance(meters) {
  if (!meters) return '';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function PharmaciesMapPage() {
  const { data, isLoading } = usePharmacies();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [flyZoom, setFlyZoom] = useState(16);
  const [userPos, setUserPos] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [selectedMode, setSelectedMode] = useState('driving');
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const pharmacies = data?.data || data || [];

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  useEffect(() => {
    const pharmaId = searchParams.get('id');
    if (pharmaId && pharmacies.length > 0) {
      const pharma = pharmacies.find((p) => String(p.id) === pharmaId);
      if (pharma && pharma.latitude && pharma.longitude) {
        handleSelectPharmacie(pharma);
      }
    }
  }, [searchParams, pharmacies]);

  useEffect(() => {
    return () => {
      if (watchId) navigator.geolocation?.clearWatch(watchId);
    };
  }, [watchId]);

  const handleSelectPharmacie = (pharma) => {
    if (!pharma.latitude || !pharma.longitude) return;
    const pos = [parseFloat(pharma.latitude), parseFloat(pharma.longitude)];
    setSelected(pharma);
    setFlyTo(pos);
    setFlyZoom(16);
    setRoute(null);
    setRouteInfo(null);
    stopTracking();
  };

  const fetchRoute = async (pharma, mode) => {
    if (!userPos) return null;
    const destLat = parseFloat(pharma.latitude);
    const destLng = parseFloat(pharma.longitude);
    const profile = mode === 'foot' ? 'foot' : 'car';
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/${profile}/${userPos[1]},${userPos[0]};${destLng},${destLat}?overview=full&geometries=geojson`
    );
    const json = await res.json();
    if (json.routes && json.routes.length > 0) {
      const r = json.routes[0];
      return {
        coords: r.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        duration: r.duration,
        distance: r.distance,
      };
    }
    return null;
  };

  const handleItineraire = async (pharma) => {
    if (!userPos) {
      alert('Impossible de déterminer votre position. Activez la géolocalisation.');
      return;
    }
    setLoadingRoute(true);
    try {
      const [driving, foot] = await Promise.all([
        fetchRoute(pharma, 'driving'),
        fetchRoute(pharma, 'foot'),
      ]);
      if (driving || foot) {
        setRouteInfo({ driving, foot });
        setSelectedMode('driving');
        const active = driving || foot;
        setRoute(active.coords);
        setFlyTo(null);
      }
    } catch {
      alert('Erreur lors du calcul de l\'itinéraire.');
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    if (routeInfo && routeInfo[mode]) {
      setRoute(routeInfo[mode].coords);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) return;
    setTracking(true);
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(newPos);
        setFlyTo(newPos);
        setFlyZoom(17);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 3000 }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation?.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
  };

  const clearRoute = () => {
    setRoute(null);
    setRouteInfo(null);
    stopTracking();
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      <div className="w-full lg:w-80 p-4 overflow-y-auto border-r bg-white">
        <h2 className="text-lg font-semibold text-noir mb-4">Pharmacies ({pharmacies.length})</h2>
        <div className="space-y-3">
          {pharmacies.map((pharma) => (
            <div
              key={pharma.id}
              className={`rounded-lg transition-colors ${selected?.id === pharma.id ? 'ring-2 ring-bleu' : ''}`}
            >
              <PharmacieCard
                pharmacie={{ ...pharma, nom: pharma.nomPharmacie, adresse: pharma.addresse }}
                onClick={() => handleSelectPharmacie(pharma)}
              />
              {selected?.id === pharma.id && pharma.latitude && pharma.longitude && !routeInfo && (
                <div className="px-4 pb-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={loadingRoute}
                    onClick={() => handleItineraire(pharma)}
                    className="w-full mt-2"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Obtenir l'itinéraire
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        <RouteInfoOverlay
          routeInfo={routeInfo}
          selectedMode={selectedMode}
          onSelectMode={handleSelectMode}
          onStart={startTracking}
          onClose={clearRoute}
          tracking={tracking}
          onStop={stopTracking}
        />

        <MapContainer
          center={DAKAR_CENTER}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToMarker position={flyTo} zoom={flyZoom} />
          {route && !tracking && <FitRoute route={route} />}
          <UserMarker position={userPos} />
          {route && <Polyline positions={route} color="#1A6FBF" weight={5} opacity={0.8} />}
          {pharmacies
            .filter((p) => p.latitude && p.longitude)
            .map((pharma) => (
              <Marker
                key={pharma.id}
                position={[parseFloat(pharma.latitude), parseFloat(pharma.longitude)]}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{pharma.nomPharmacie}</p>
                    <p className="text-gray-600">{pharma.addresse}</p>
                    {pharma.numTel && <p className="text-gray-600">{pharma.numTel}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
