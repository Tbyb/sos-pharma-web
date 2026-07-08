import { useQuery } from '@tanstack/react-query';
import { getPharmaciesAPI, getPharmacieAPI } from '../api/pharmacies.api';

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
