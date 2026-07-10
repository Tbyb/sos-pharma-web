import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationsAPI, marquerNotificationLueAPI, marquerToutesNotificationsLuesAPI,
} from '../api/notifications.api';

export function useNotifications(params = {}) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotificationsAPI(params).then((res) => res.data),
    refetchInterval: 30000,
  });
}

export function useMarquerNotificationLue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => marquerNotificationLueAPI(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarquerToutesNotificationsLues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => marquerToutesNotificationsLuesAPI().then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
