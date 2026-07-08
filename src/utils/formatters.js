/**
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * @param {number} montant
 * @returns {string}
 */
export function formatMontant(montant) {
  if (montant == null) return '';
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
}

/**
 * @param {string} statut
 * @param {object} statutsMap
 * @returns {string}
 */
export function formatStatut(statut, statutsMap) {
  return statutsMap[statut]?.label || statut;
}
