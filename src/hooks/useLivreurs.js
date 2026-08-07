import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  creerLivreurAPI, getLivreursAPI, getLivreurAPI, getLivreurMissionsAPI,
  suspendreLivreurAPI, reactiverLivreurAPI,
} from '../api/livreurs.api';

export function useLivreurs() {
  return useQuery({
    queryKey: ['livreurs'],
    queryFn: () => getLivreursAPI().then((res) => res.data),
  });
}

export function useCreerLivreur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => creerLivreurAPI(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['livreurs'] }),
  });
}

/**
 * @param {string|number} id
 */
export function useLivreurDetail(id) {
  return useQuery({
    queryKey: ['livreurs', id],
    queryFn: () => getLivreurAPI(id).then((res) => res.data),
    enabled: !!id,
  });
}

/**
 * @param {string|number} id
 */
export function useLivreurMissions(id) {
  return useQuery({
    queryKey: ['livreurs', id, 'livraisons'],
    queryFn: () => getLivreurMissionsAPI(id).then((res) => res.data),
    enabled: !!id,
  });
}

function useChangerStatutLivreur(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['livreurs'] });
      queryClient.invalidateQueries({ queryKey: ['livreurs', id] });
    },
  });
}

export function useSuspendreLivreur() {
  return useChangerStatutLivreur((id) => suspendreLivreurAPI(id).then((res) => res.data));
}

export function useReactiverLivreur() {
  return useChangerStatutLivreur((id) => reactiverLivreurAPI(id).then((res) => res.data));
}
