import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  creerCommandeAPI,
  getMesCommandesAPI,
  getCommandeDetailAPI,
  annulerCommandeAPI,
  supprimerCommandeAPI,
  modifierCommandeAPI,
  getAdminCommandesAPI,
  getAdminCommandeDetailAPI,
  getCommandesPharmacieAPI,
  accepterCommandeAPI,
  refuserCommandeAPI,
  marquerPreteAPI,
} from '../api/commandes.api';

export function useMesCommandes(params = {}) {
  return useQuery({
    queryKey: ['mes-commandes', params],
    queryFn: () => getMesCommandesAPI(params).then((res) => res.data),
  });
}

export function useCommandeDetail(id) {
  return useQuery({
    queryKey: ['mes-commandes', id],
    queryFn: () => getCommandeDetailAPI(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreerCommande() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => creerCommandeAPI(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mes-commandes'] });
    },
  });
}

export function useAnnulerCommande() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => annulerCommandeAPI(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mes-commandes'] });
    },
  });
}

export function useSupprimerCommande() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => supprimerCommandeAPI(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mes-commandes'] });
    },
  });
}

export function useModifierCommande() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => modifierCommandeAPI(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mes-commandes'] });
    },
  });
}

/**
 * @param {{ idPharmacie?: number|string, statut?: string, page?: number, date_debut?: string, date_fin?: string }} params
 */
export function useAdminCommandes(params = {}) {
  return useQuery({
    queryKey: ['admin-commandes', params],
    queryFn: () => getAdminCommandesAPI(params).then((res) => res.data),
  });
}

/**
 * @param {string|number} id
 */
export function useAdminCommandeDetail(id) {
  return useQuery({
    queryKey: ['admin-commandes', id],
    queryFn: () => getAdminCommandeDetailAPI(id).then((res) => res.data),
    enabled: !!id,
  });
}

/**
 * @param {{ statut?: string, page?: number }} params
 */
export function useCommandesPharmacie(params = {}) {
  return useQuery({
    queryKey: ['commandes-pharmacie', params],
    queryFn: () => getCommandesPharmacieAPI(params).then((res) => res.data),
  });
}

function useChangerStatutCommande(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['commandes-pharmacie'] }),
  });
}

export function useAccepterCommande() {
  return useChangerStatutCommande((id) => accepterCommandeAPI(id).then((res) => res.data));
}

export function useRefuserCommande() {
  return useChangerStatutCommande(({ id, motif }) => refuserCommandeAPI(id, motif).then((res) => res.data));
}

export function useMarquerPrete() {
  return useChangerStatutCommande((id) => marquerPreteAPI(id).then((res) => res.data));
}
