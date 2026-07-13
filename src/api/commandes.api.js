import axiosInstance from './axiosInstance';

export function creerCommandeAPI(data) {
  return axiosInstance.post('/commandes', data);
}

export function estimerFraisLivraisonAPI(data) {
  return axiosInstance.post('/commandes/estimation-livraison', data);
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

export function getAdminCommandesAPI(params = {}) {
  return axiosInstance.get('/admin/commandes', { params });
}

export function getAdminCommandeDetailAPI(id) {
  return axiosInstance.get(`/admin/commandes/${id}`);
}

export function getCommandesPharmacieAPI(params = {}) {
  return axiosInstance.get('/commandes', { params });
}

export function accepterCommandeAPI(id) {
  return axiosInstance.put(`/commandes/${id}/accepter`);
}

export function refuserCommandeAPI(id, motif) {
  return axiosInstance.put(`/commandes/${id}/refuser`, { motif });
}

export function marquerPreteAPI(id) {
  return axiosInstance.put(`/commandes/${id}/pret`);
}
