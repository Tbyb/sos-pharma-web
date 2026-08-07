import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { usePharmacies } from '../../hooks/usePharmacies';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PharmacieCard from '../../components/molecules/PharmacieCard';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, X, Car, Footprints, Clock } from 'lucide-react';
import { calculerDistanceKm, formatDistanceKm } from '../../utils/geo';
import { STATUTS_PHARMACIE } from '../../utils/constants';

// Vitesse de marche moyenne utilisée pour estimer la durée à pied (voir handleItineraire).
const VITESSE_MARCHE_MPS = 1.4; // ≈ 5 km/h

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
    html: '<div style="width:14px;height:14px;background:#1A3A5C;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.3)"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
  return <Marker position={position} icon={icon}><Popup>Votre position</Popup></Marker>;
}

function RouteInfoOverlay({ routeInfo, selectedMode, onSelectMode, onStart, onClose, tracking, onStop }) {
  if (!routeInfo) return null;
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-[8px] border border-gris-bordure shadow-[0_4px_16px_rgba(0,0,0,0.1)] p-4 w-[calc(100vw-2rem)] max-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-bleu-nuit text-sm">Itinéraire</span>
        <button onClick={onClose} className="p-1 hover:bg-vert-menthe rounded-[6px] transition-colors duration-200 cursor-pointer">
          <X className="w-4 h-4 text-gris-doux" />
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onSelectMode('driving')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[6px] text-sm cursor-pointer transition-colors duration-200 ${selectedMode === 'driving' ? 'bg-vert-medical text-white' : 'bg-blanc-casse text-bleu-nuit hover:bg-vert-menthe'}`}
        >
          <Car className="w-4 h-4" />
          <span className="font-mono">{formatDuration(routeInfo.driving?.duration)}</span>
        </button>
        <button
          onClick={() => onSelectMode('foot')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[6px] text-sm cursor-pointer transition-colors duration-200 ${selectedMode === 'foot' ? 'bg-vert-medical text-white' : 'bg-blanc-casse text-bleu-nuit hover:bg-vert-menthe'}`}
        >
          <Footprints className="w-4 h-4" />
          <span className="font-mono">{formatDuration(routeInfo.foot?.duration)}</span>
        </button>
      </div>

      <p className="text-xs text-gris-doux text-center mb-3 font-mono">
        {formatDistance(routeInfo[selectedMode]?.distance)}
      </p>

      {!tracking ? (
        <button
          onClick={onStart}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-[6px] bg-vert-medical hover:bg-vert-profond text-white text-sm font-medium transition-colors duration-200"
        >
          <Navigation className="w-3.5 h-3.5" />
          Suivre l'itinéraire
        </button>
      ) : (
        <button
          onClick={onStop}
          className="w-full py-2.5 rounded-[6px] bg-danger hover:bg-[#B91C1C] text-white text-sm font-medium transition-colors duration-200"
        >
          Arrêter le suivi
        </button>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const pharmaIdUrl = searchParams.get('id');

  // L'URL est l'unique source de verite pour la selection : "selected" est
  // entierement derive (useMemo), aucun useEffect ne synchronise d'etat local.
  const [routeState, setRouteState] = useState({ pharmaId: null, route: null, routeInfo: null });
  const [userPos, setUserPos] = useState(null);
  const [selectedMode, setSelectedMode] = useState('driving');
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const pharmacies = useMemo(() => data?.data || data || [], [data]);

  const selected = useMemo(() => {
    if (!pharmaIdUrl) return null;
    return pharmacies.find((p) => String(p.id) === pharmaIdUrl) || null;
  }, [pharmaIdUrl, pharmacies]);

  // La route affichee ne concerne que la pharmacie actuellement selectionnee :
  // changer de selection la rend automatiquement obsolete, sans reset explicite.
  const route = selected && routeState.pharmaId === selected.id ? routeState.route : null;
  const routeInfo = selected && routeState.pharmaId === selected.id ? routeState.routeInfo : null;

  const flyToSelected = useMemo(() => {
    if (!selected?.latitude || !selected?.longitude) return null;
    return [parseFloat(selected.latitude), parseFloat(selected.longitude)];
  }, [selected]);

  const flyTo = tracking ? userPos : flyToSelected;
  const flyZoom = tracking ? 17 : 16;

  const stopTracking = useCallback(() => {
    setWatchId((id) => {
      if (id) navigator.geolocation?.clearWatch(id);
      return null;
    });
    setTracking(false);
  }, []);

  const handleSelectPharmacie = useCallback((pharma) => {
    if (!pharma.latitude || !pharma.longitude) return;
    stopTracking();
    setSearchParams({ id: String(pharma.id) });
  }, [stopTracking, setSearchParams]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  useEffect(() => {
    return () => {
      if (watchId) navigator.geolocation?.clearWatch(watchId);
    };
  }, [watchId]);

  // Le serveur public OSRM (router.project-osrm.org) ne calcule en réalité que des
  // itinéraires routiers (voiture) : lui demander le profil "foot" renvoie exactement
  // la même réponse que "driving" (vérifié). Un vrai routage piéton nécessiterait un
  // service dédié (ex. OpenRouteService, avec clé API). En attendant, on récupère
  // uniquement l'itinéraire voiture et on estime la marche à partir de cette même
  // distance à une vitesse de marche moyenne — ça reste une estimation, mais au moins
  // cohérente (différente de la voiture, proportionnelle à la distance réelle).
  const fetchRoute = async (pharma) => {
    if (!userPos) return null;
    const destLat = parseFloat(pharma.latitude);
    const destLng = parseFloat(pharma.longitude);
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${userPos[1]},${userPos[0]};${destLng},${destLat}?overview=full&geometries=geojson`
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
      toast.error('Impossible de déterminer votre position. Activez la géolocalisation.');
      return;
    }
    setLoadingRoute(true);
    try {
      const driving = await fetchRoute(pharma);
      if (driving) {
        const foot = {
          coords: driving.coords,
          distance: driving.distance,
          duration: driving.distance / VITESSE_MARCHE_MPS,
        };
        setSelectedMode('driving');
        setRouteState({ pharmaId: pharma.id, route: driving.coords, routeInfo: { driving, foot } });
      } else {
        toast.error('Aucun itinéraire trouvé vers cette pharmacie.');
      }
    } catch {
      toast.error("Erreur lors du calcul de l'itinéraire.");
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    setRouteState((r) => (r.routeInfo?.[mode] ? { ...r, route: r.routeInfo[mode].coords } : r));
  };

  const startTracking = () => {
    if (!navigator.geolocation) return;
    setTracking(true);
    const id = navigator.geolocation.watchPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, maximumAge: 3000 }
    );
    setWatchId(id);
  };

  const clearRoute = () => {
    setRouteState({ pharmaId: null, route: null, routeInfo: null });
    stopTracking();
  };

  const pharmaciesGeolocalisees = useMemo(
    () => pharmacies.filter((p) => p.latitude && p.longitude),
    [pharmacies]
  );

  const distancePharmacie = useCallback((pharma) => {
    if (!userPos || !pharma.latitude || !pharma.longitude) return null;
    return calculerDistanceKm(userPos[0], userPos[1], parseFloat(pharma.latitude), parseFloat(pharma.longitude));
  }, [userPos]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      <div className="w-full lg:w-80 p-4 overflow-y-auto border-r border-gris-bordure bg-white">
        <h2 className="font-display text-xl text-bleu-nuit mb-1">Pharmacies ({pharmacies.length})</h2>
        <p className="text-sm text-gris-doux mb-4">Trouvez la pharmacie certifiée la plus proche et obtenez votre itinéraire.</p>
        <div className="space-y-3">
          {pharmacies.map((pharma) => (
            <div key={pharma.id}>
              <PharmacieCard
                pharmacie={pharma}
                selected={selected?.id === pharma.id}
                onClick={() => handleSelectPharmacie(pharma)}
                distanceKm={distancePharmacie(pharma)}
              />
              {selected?.id === pharma.id && pharma.latitude && pharma.longitude && !routeInfo && (
                <div className="px-1 pt-2">
                  <button
                    onClick={() => handleItineraire(pharma)}
                    disabled={loadingRoute}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-[6px] border border-vert-medical text-vert-medical hover:bg-vert-menthe transition-colors duration-200 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    {loadingRoute ? 'Calcul...' : "Obtenir l'itinéraire"}
                  </button>
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
          {route && <Polyline positions={route} color="#12A05C" weight={5} opacity={0.8} />}
          {pharmaciesGeolocalisees.map((pharma) => (
            <Marker
              key={pharma.id}
              position={[parseFloat(pharma.latitude), parseFloat(pharma.longitude)]}
              eventHandlers={{ click: () => handleSelectPharmacie(pharma) }}
            >
              <Popup minWidth={220}>
                <div className="text-sm space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-bleu-nuit">{pharma.nomPharmacie}</p>
                    {pharma.statut === 'active' && (
                      <Badge couleur={STATUTS_PHARMACIE.active.couleur} fond={STATUTS_PHARMACIE.active.fond}>
                        {STATUTS_PHARMACIE.active.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{pharma.addresse}</p>
                  {(pharma.ouvert_24h || pharma.horaires) && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {pharma.ouvert_24h ? 'Ouvert 24h/24' : pharma.horaires}
                    </p>
                  )}
                  {pharma.numTel && <p className="text-gray-600 font-mono">{pharma.numTel}</p>}
                  {distancePharmacie(pharma) != null && (
                    <p className="text-bleu-nuit font-mono text-xs">{formatDistanceKm(distancePharmacie(pharma))}</p>
                  )}
                  <button
                    onClick={() => handleItineraire(pharma)}
                    disabled={loadingRoute}
                    className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-[6px] bg-vert-medical hover:bg-vert-profond disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors duration-200 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    {loadingRoute ? 'Calcul...' : "Obtenir l'itinéraire"}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
