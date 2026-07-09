import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMedicamentsAPI, getMedicamentAPI, getComparaisonPrixAPI,
  getAdminMedicamentsAPI, creerMedicamentAPI, modifierMedicamentAPI,
  desactiverMedicamentAPI, reactiverMedicamentAPI,
  getReferentielPharmacienAPI,
} from '../api/medicaments.api';

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

/**
 * @param {{ search?: string, statut?: string, page?: number }} params
 */
export function useAdminMedicaments(params = {}) {
  return useQuery({
    queryKey: ['admin-medicaments', params],
    queryFn: () => getAdminMedicamentsAPI(params).then((res) => res.data),
  });
}

export function useCreerMedicament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => creerMedicamentAPI(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-medicaments'] }),
  });
}

export function useModifierMedicament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => modifierMedicamentAPI(id, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-medicaments'] }),
  });
}

export function useDesactiverMedicament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => desactiverMedicamentAPI(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-medicaments'] }),
  });
}

export function useReactiverMedicament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reactiverMedicamentAPI(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-medicaments'] }),
  });
}

/**
 * @param {{ search?: string }} params
 */
export function useReferentielPharmacien(params = {}) {
  return useQuery({
    queryKey: ['referentiel-pharmacien', params],
    queryFn: () => getReferentielPharmacienAPI(params).then((res) => res.data),
  });
}
