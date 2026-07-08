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
