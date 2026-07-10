import { useState, useCallback } from 'react';

/**
 * @returns {{ position: {latitude: number, longitude: number}|null, statut: 'inactif'|'chargement'|'autorise'|'refuse', demanderPosition: () => void }}
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [statut, setStatut] = useState('inactif');

  const demanderPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setStatut('refuse');
      return;
    }
    setStatut('chargement');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatut('autorise');
      },
      () => setStatut('refuse'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return { position, statut, demanderPosition };
}
