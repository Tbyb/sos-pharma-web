export const PHARMACIE_ACTIONS = {
  certifier: {
    titre: 'Certifier la pharmacie',
    description: (p) => `Certifier "${p.nomPharmacie}" ? Elle pourra recevoir des commandes des patients.`,
    confirmLabel: 'Certifier',
    variant: 'secondary',
    succes: 'Pharmacie certifiée.',
  },
  refuser: {
    titre: 'Refuser la pharmacie',
    description: (p) => `Refuser l'inscription de "${p.nomPharmacie}" ? Cette action est définitive.`,
    confirmLabel: 'Refuser',
    variant: 'danger',
    succes: 'Pharmacie refusée.',
    motifRequis: true,
  },
  suspendre: {
    titre: 'Suspendre la pharmacie',
    description: (p) => `Suspendre "${p.nomPharmacie}" ? Elle ne pourra plus recevoir de nouvelles commandes.`,
    confirmLabel: 'Suspendre',
    variant: 'danger',
    succes: 'Pharmacie suspendue.',
  },
  reactiver: {
    titre: 'Réactiver la pharmacie',
    description: (p) => `Réactiver "${p.nomPharmacie}" ? Elle pourra de nouveau recevoir des commandes.`,
    confirmLabel: 'Réactiver',
    variant: 'secondary',
    succes: 'Pharmacie réactivée.',
  },
};
