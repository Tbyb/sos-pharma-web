import axiosInstance from './axiosInstance';

export function initierPaiementAPI(data) {
  return axiosInstance.post('/paiements/initier', data);
}

export function confirmerPaiementAPI(reference) {
  return axiosInstance.post('/paiements/simulation/confirmer', null, { params: { ref: reference } });
}

export function verifierPaiementAPI(reference) {
  return axiosInstance.get(`/paiements/${reference}/statut`);
}

export function getAdminPaiementsAPI(params = {}) {
  return axiosInstance.get('/admin/paiements', { params });
}
