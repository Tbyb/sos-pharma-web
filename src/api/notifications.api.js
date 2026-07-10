import axiosInstance from './axiosInstance';

export function getNotificationsAPI(params = {}) {
  return axiosInstance.get('/notifications', { params });
}

export function marquerNotificationLueAPI(id) {
  return axiosInstance.put(`/notifications/${id}/lire`);
}

export function marquerToutesNotificationsLuesAPI() {
  return axiosInstance.put('/notifications/lire-tout');
}
