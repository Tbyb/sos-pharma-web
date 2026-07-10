import { useState, useCallback } from 'react';

/**
 * @returns {{ position: {latitude: number, longitude: number}|null, statut: 'inactif'|'chargement'|'autorise'|'refuse', demanderPosition: (options?: { onSuccess?: (coords: {latitude: number, longitude: number}) => void }) => void }}
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [statut, setStatut] = useState('inactif');

  const demanderPosition = useCallback((options = {}) => {
    if (!navigator.geolocation) {
      setStatut('refuse');
      return;
    }
    setStatut('chargement');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setPosition(coords);
        setStatut('autorise');
        options.onSuccess?.(coords);
      },
      () => setStatut('refuse'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return { position, statut, demanderPosition };
}
