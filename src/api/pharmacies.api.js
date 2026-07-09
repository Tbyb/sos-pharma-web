import axiosInstance from './axiosInstance';

export function getPharmaciesAPI(params = {}) {
  return axiosInstance.get('/pharmacies', { params });
}

export function getPharmacieAPI(id) {
  return axiosInstance.get(`/pharmacies/${id}`);
}

export function getPharmaciesCatalogueAPI(id) {
  return axiosInstance.get(`/pharmacies/${id}/catalogue`);
}

export function getAdminPharmaciesAPI(params = {}) {
  return axiosInstance.get('/admin/pharmacies', { params });
}

export function accepterPharmacieAPI(id) {
  return axiosInstance.put(`/pharmacies/${id}/accepter`);
}

export function refuserPharmacieAPI(id) {
  return axiosInstance.put(`/pharmacies/${id}/refuser`);
}

export function suspendrePharmacieAPI(id) {
  return axiosInstance.put(`/pharmacies/${id}/suspendre`);
}

export function reactiverPharmacieAPI(id) {
  return axiosInstance.put(`/pharmacies/${id}/reactiver`);
}
