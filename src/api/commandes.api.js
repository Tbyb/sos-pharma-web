import axiosInstance from './axiosInstance';

export function creerCommandeAPI(data) {
  return axiosInstance.post('/commandes', data);
}

export function getMesCommandesAPI(params = {}) {
  return axiosInstance.get('/mes-commandes', { params });
}

export function getCommandeDetailAPI(id) {
  return axiosInstance.get(`/commandes/${id}`);
}

export function annulerCommandeAPI(id) {
  return axiosInstance.put(`/commandes/${id}/annuler`);
}

export function supprimerCommandeAPI(id) {
  return axiosInstance.delete(`/commandes/${id}`);
}

export function modifierCommandeAPI(id, data) {
  return axiosInstance.put(`/commandes/${id}`, data);
}
