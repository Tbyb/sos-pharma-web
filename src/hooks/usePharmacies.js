import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPharmaciesAPI, getPharmacieAPI, getPharmaciesCatalogueAPI,
  getAdminPharmaciesAPI, accepterPharmacieAPI, refuserPharmacieAPI,
  suspendrePharmacieAPI, reactiverPharmacieAPI,
} from '../api/pharmacies.api';

/**
 * @param {object} params
 */
export function usePharmacies(params = {}) {
  return useQuery({
    queryKey: ['pharmacies', params],
    queryFn: () => getPharmaciesAPI(params).then((res) => res.data),
  });
}

/**
 * @param {string|number} id
 */
export function usePharmacieDetail(id) {
  return useQuery({
    queryKey: ['pharmacies', id],
    queryFn: () => getPharmacieAPI(id).then((res) => res.data),
    enabled: !!id,
  });
}

/**
 * @param {string|number} id
 */
export function usePharmacieCatalogue(id) {
  return useQuery({
    queryKey: ['pharmacies', id, 'catalogue'],
    queryFn: () => getPharmaciesCatalogueAPI(id).then((res) => res.data),
    enabled: !!id,
  });
}

/**
 * @param {{ search?: string, statut?: string, page?: number }} params
 */
export function useAdminPharmacies(params = {}) {
  return useQuery({
    queryKey: ['admin-pharmacies', params],
    queryFn: () => getAdminPharmaciesAPI(params).then((res) => res.data),
  });
}

function useChangerStatutPharmacie(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-pharmacies'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacies', id] });
    },
  });
}

export function useAccepterPharmacie() {
  return useChangerStatutPharmacie((id) => accepterPharmacieAPI(id).then((res) => res.data));
}

export function useRefuserPharmacie() {
  return useChangerStatutPharmacie((id) => refuserPharmacieAPI(id).then((res) => res.data));
}

export function useSuspendrePharmacie() {
  return useChangerStatutPharmacie((id) => suspendrePharmacieAPI(id).then((res) => res.data));
}

export function useReactiverPharmacie() {
  return useChangerStatutPharmacie((id) => reactiverPharmacieAPI(id).then((res) => res.data));
}
