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

// Construit un FormData si une photo (File) est présente, sinon renvoie l'objet tel quel.
// Laravel ne parse pas le multipart sur un vrai PUT : on passe alors par POST + _method=PUT.
function versFormDataSiPhoto(data) {
  if (!(data.photo instanceof File)) return data;

  const formData = new FormData();
  Object.entries(data).forEach(([cle, valeur]) => {
    if (valeur !== null && valeur !== undefined) formData.append(cle, valeur);
  });
  return formData;
}

export function creerMedicamentAPI(data) {
  return axiosInstance.post('/medicaments', versFormDataSiPhoto(data));
}

export function modifierMedicamentAPI(id, data) {
  const payload = versFormDataSiPhoto(data);
  if (payload instanceof FormData) {
    payload.append('_method', 'PUT');
    return axiosInstance.post(`/medicaments/${id}`, payload);
  }
  return axiosInstance.put(`/medicaments/${id}`, payload);
}

export function desactiverMedicamentAPI(id) {
  return axiosInstance.patch(`/medicaments/${id}/desactiver`);
}

export function reactiverMedicamentAPI(id) {
  return axiosInstance.patch(`/medicaments/${id}/reactiver`);
}

export function getReferentielPharmacienAPI(params = {}) {
  return axiosInstance.get('/ma-pharmacie/referentiel', { params });
}
