import { useQuery } from '@tanstack/react-query';
import { getMedicamentsAPI, getMedicamentAPI, getComparaisonPrixAPI } from '../api/medicaments.api';

/**
 * @param {{ search?: string, page?: number }} params
 */
export function useMedicaments(params = {}) {
  return useQuery({
    queryKey: ['medicaments', params],
    queryFn: () => getMedicamentsAPI(params).then((res) => res.data),
  });
}

/**
 * @param {string|number} id
 */
export function useMedicamentDetail(id) {
  return useQuery({
    queryKey: ['medicaments', id],
    queryFn: () => getMedicamentAPI(id).then((res) => res.data),
    enabled: !!id,
  });
}

/**
 * @param {string|number} id
 */
export function useComparaisonPrix(id) {
  return useQuery({
    queryKey: ['medicaments', id, 'comparaison'],
    queryFn: () => getComparaisonPrixAPI(id).then((res) => res.data),
    enabled: !!id,
  });
}
