const RAYON_TERRE_KM = 6371;

/**
 * Distance a vol d'oiseau (formule de Haversine), en kilometres.
 */
export function calculerDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RAYON_TERRE_KM * c;
}

export function formatDistanceKm(km) {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/**
 * Convertit des coordonnees GPS en adresse lisible (Nominatim/OpenStreetMap).
 * @returns {Promise<string|null>}
 */
export async function geocoderInverse(latitude, longitude) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=0`
  );
  if (!res.ok) throw new Error('Géocodage impossible');
  const data = await res.json();
  return data.display_name || null;
}
