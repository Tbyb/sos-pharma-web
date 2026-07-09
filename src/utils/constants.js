export const COULEURS = {
  vert: '#1B8A4C',
  vert_fonce: '#146B3A',
  vert_clair: '#E8F5EE',
  bleu: '#1A6FBF',
  bleu_clair: '#EBF3FB',
  bleu_fonce: '#1558A0',
  blanc: '#FFFFFF',
  gris_clair: '#F4F6F8',
  gris: '#6B7280',
  noir: '#1F2937',
  danger: '#DC2626',
  warning: '#D97706',
  succes: '#16A34A',
};

export const STATUTS_COMMANDE = {
  en_attente: { label: 'En attente', couleur: '#D97706', fond: '#FEF9C3' },
  en_cours: { label: 'En attente', couleur: '#D97706', fond: '#FEF9C3' },
  acceptee: { label: 'Acceptée', couleur: '#2563EB', fond: '#DBEAFE' },
  en_preparation: { label: 'En préparation', couleur: '#7C3AED', fond: '#EDE9FE' },
  prete: { label: 'Prête', couleur: '#4F46E5', fond: '#E0E7FF' },
  en_livraison: { label: 'En livraison', couleur: '#0891B2', fond: '#CFFAFE' },
  livree: { label: 'Livrée', couleur: '#16A34A', fond: '#DCFCE7' },
  retiree: { label: 'Retirée', couleur: '#16A34A', fond: '#DCFCE7' },
  annulee: { label: 'Annulée', couleur: '#6B7280', fond: '#F3F4F6' },
  refusee: { label: 'Refusée', couleur: '#DC2626', fond: '#FEE2E2' },
};

export const STATUTS_PHARMACIE = {
  en_attente: { label: 'En attente', couleur: '#D97706', fond: '#FEF9C3' },
  active: { label: 'Certifiée', couleur: '#16A34A', fond: '#DCFCE7' },
  refusee: { label: 'Refusée', couleur: '#DC2626', fond: '#FEE2E2' },
  suspendue: { label: 'Suspendue', couleur: '#6B7280', fond: '#F3F4F6' },
};

export const STATUTS_PAIEMENT = {
  en_attente: { label: 'En attente', couleur: '#D97706', fond: '#FEF9C3' },
  complete: { label: 'Complété', couleur: '#16A34A', fond: '#DCFCE7' },
  echoue: { label: 'Échoué', couleur: '#DC2626', fond: '#FEE2E2' },
};

export const ROLES = {
  ADMIN: 'administrateur',
  PHARMACIEN: 'pharmacien',
  PATIENT: 'patient',
};
