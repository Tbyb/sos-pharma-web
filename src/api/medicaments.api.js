import axiosInstance from './axiosInstance';

export function getMedicamentsAPI(params = {}) {
  return axiosInstance.get('/medicaments', { params });
}

export function getMedicamentAPI(id) {
  return axiosInstance.get(`/medicaments/${id}`);
}

export function getComparaisonPrixAPI(id) {
  return axiosInstance.get(`/medicaments/${id}/comparaison-prix`);
}
