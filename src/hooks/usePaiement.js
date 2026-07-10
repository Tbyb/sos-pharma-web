import { useQuery, useMutation } from '@tanstack/react-query';
import { initierPaiementAPI, confirmerPaiementAPI, verifierPaiementAPI, getAdminPaiementsAPI } from '../api/paiements.api';

export function useInitierPaiement() {
  return useMutation({
    mutationFn: (data) => initierPaiementAPI(data).then((res) => res.data),
  });
}

export function useConfirmerPaiement() {
  return useMutation({
    mutationFn: (reference) => confirmerPaiementAPI(reference).then((res) => res.data),
  });
}

export function useVerifierPaiement(reference) {
  return useQuery({
    queryKey: ['paiement', reference],
    queryFn: () => verifierPaiementAPI(reference).then((res) => res.data),
    enabled: !!reference,
  });
}

/**
 * @param {{ statut?: string, mode?: string, date_debut?: string, date_fin?: string, page?: number }} params
 */
export function useAdminPaiements(params = {}) {
  return useQuery({
    queryKey: ['admin-paiements', params],
    queryFn: () => getAdminPaiementsAPI(params).then((res) => res.data),
  });
}
