import axiosInstance from './axiosInstance';

export function getCatalogueAPI() {
  return axiosInstance.get('/ma-pharmacie/catalogue');
}

export function ajouterMedicamentCatalogueAPI(data) {
  return axiosInstance.post('/ma-pharmacie/catalogue', data);
}

export function modifierCatalogueAPI(id, data) {
  return axiosInstance.put(`/ma-pharmacie/catalogue/${id}/dispoPrix`, data);
}

export function toggleDisponibiliteAPI(id, disponible) {
  return axiosInstance.patch(`/ma-pharmacie/catalogue/${id}/disponibilite`, { disponible });
}

export function retirerCatalogueAPI(id) {
  return axiosInstance.delete(`/ma-pharmacie/catalogue/${id}`);
}

export function importerCatalogueAPI(fichier) {
  const formData = new FormData();
  formData.append('fichier', fichier);
  return axiosInstance.post('/ma-pharmacie/catalogue/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
