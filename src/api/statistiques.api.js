import axiosInstance from './axiosInstance';

export function getDashboardStatsAPI() {
  return axiosInstance.get('/statistiques/dashboard');
}

export function getDashboardPharmacienStatsAPI() {
  return axiosInstance.get('/ma-pharmacie/statistiques');
}
