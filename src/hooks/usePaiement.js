import { useQuery, useMutation } from '@tanstack/react-query';
import { initierPaiementAPI, confirmerPaiementAPI, verifierPaiementAPI } from '../api/paiements.api';

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
