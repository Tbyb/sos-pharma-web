import axiosInstance from './axiosInstance';

export function creerLivreurAPI(data) {
  return axiosInstance.post('/livreurs', data);
}

export function getLivreursAPI() {
  return axiosInstance.get('/livreurs');
}

export function getLivreurAPI(id) {
  return axiosInstance.get(`/livreurs/${id}`);
}

export function getLivreurMissionsAPI(id) {
  return axiosInstance.get(`/livreurs/${id}/livraisons`);
}

export function suspendreLivreurAPI(id) {
  return axiosInstance.patch(`/livreurs/${id}/suspendre`);
}

export function reactiverLivreurAPI(id) {
  return axiosInstance.patch(`/livreurs/${id}/reactiver`);
}
