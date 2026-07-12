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

// Palette DESIGN.md : orange corail (attente), bleu nuit (en cours), vert (positif/termine),
// rouge (refuse/echoue, hors palette identite mais sanctionne par le spec Bouton Danger),
// gris doux (annule/suspendu). Peu de teintes, statuts regroupes par sens plutot qu'un
// coloris unique par statut.
export const STATUTS_COMMANDE = {
  en_attente: { label: 'En attente de confirmation', couleur: '#FF6B35', fond: '#FFF1EC' },
  en_cours: { label: 'En attente de confirmation', couleur: '#FF6B35', fond: '#FFF1EC' },
  acceptee: { label: 'Acceptée', couleur: '#1A3A5C', fond: '#E9EEF3' },
  en_preparation: { label: 'En préparation', couleur: '#1A3A5C', fond: '#E9EEF3' },
  prete: { label: 'Prête à récupérer', couleur: '#0A5C36', fond: '#E8F5EE' },
  en_livraison: { label: 'En livraison', couleur: '#0A5C36', fond: '#E8F5EE' },
  livree: { label: 'Livrée', couleur: '#0A5C36', fond: '#E8F5EE' },
  retiree: { label: 'Retirée', couleur: '#0A5C36', fond: '#E8F5EE' },
  annulee: { label: 'Annulée', couleur: '#6B7280', fond: '#F3F4F6' },
  refusee: { label: 'Refusée', couleur: '#DC2626', fond: '#FEE2E2' },
};

export const STATUTS_PHARMACIE = {
  en_attente: { label: 'En attente', couleur: '#FF6B35', fond: '#FFF1EC' },
  active: { label: 'Certifiée', couleur: '#0A5C36', fond: '#E8F5EE' },
  refusee: { label: 'Refusée', couleur: '#DC2626', fond: '#FEE2E2' },
  suspendue: { label: 'Suspendue', couleur: '#6B7280', fond: '#F3F4F6' },
};

export const STATUTS_LIVRAISON = {
  en_attente: { label: 'En attente', couleur: '#FF6B35', fond: '#FFF1EC' },
  acceptee: { label: 'Acceptée', couleur: '#1A3A5C', fond: '#E9EEF3' },
  recupere: { label: 'Récupérée', couleur: '#1A3A5C', fond: '#E9EEF3' },
  en_cours: { label: 'En cours', couleur: '#1A3A5C', fond: '#E9EEF3' },
  livree: { label: 'Livrée', couleur: '#0A5C36', fond: '#E8F5EE' },
  refusee: { label: 'Refusée', couleur: '#DC2626', fond: '#FEE2E2' },
};

export const STATUTS_PAIEMENT = {
  en_attente: { label: 'En attente', couleur: '#FF6B35', fond: '#FFF1EC' },
  'complété': { label: 'Complété', couleur: '#0A5C36', fond: '#E8F5EE' },
  'échoué': { label: 'Échoué', couleur: '#DC2626', fond: '#FEE2E2' },
};

// Doit rester synchronisé avec la validation de PaiementController::initier() (backend)
export const MODES_PAIEMENT = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  free_money: 'Free Money',
  carte: 'Carte bancaire',
};

export const ROLES = {
  ADMIN: 'administrateur',
  PHARMACIEN: 'pharmacien',
  PATIENT: 'patient',
};
