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

export function getAdminMedicamentsAPI(params = {}) {
  return axiosInstance.get('/admin/medicaments', { params });
}

export function creerMedicamentAPI(data) {
  return axiosInstance.post('/medicaments', data);
}

export function modifierMedicamentAPI(id, data) {
  return axiosInstance.put(`/medicaments/${id}`, data);
}

export function desactiverMedicamentAPI(id) {
  return axiosInstance.patch(`/medicaments/${id}/desactiver`);
}

export function reactiverMedicamentAPI(id) {
  return axiosInstance.patch(`/medicaments/${id}/reactiver`);
}
