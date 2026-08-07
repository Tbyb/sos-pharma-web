import { AlertCircle, CheckCircle2, PlusCircle, RefreshCw } from 'lucide-react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import { formatMontant } from '../../utils/formatters';

const STATUTS = {
  nouveau_medicament: { label: 'Nouveau médicament', classe: 'bg-vert-menthe text-vert-profond', icone: PlusCircle },
  nouveau_dans_catalogue: { label: 'Ajout au catalogue', classe: 'bg-vert-menthe text-vert-profond', icone: PlusCircle },
  mise_a_jour: { label: 'Mise à jour', classe: 'bg-[#FFF0E9] text-orange-corail', icone: RefreshCw },
  erreur: { label: 'Erreur', classe: 'bg-[#FEE2E2] text-danger', icone: AlertCircle },
};

function Badge({ statut }) {
  const config = STATUTS[statut];
  if (!config) return null;
  const Icone = config.icone;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-xs font-medium whitespace-nowrap ${config.classe}`}>
      <Icone className="w-3.5 h-3.5" /> {config.label}
    </span>
  );
}

/**
 * Aperçu d'un import CSV/Excel avant confirmation : affiche, ligne par ligne,
 * ce qui sera fait (nouveau médicament, mise à jour, ou erreur) et laisse le
 * pharmacien confirmer ou annuler avant toute écriture en base.
 *
 * @param {{
 *   open: boolean, onClose: () => void, onConfirmer: () => void,
 *   apercu: { lignes: Array, resume: object } | undefined,
 *   loading: boolean, confirming: boolean,
 * }} props
 */
export default function ImportApercuModal({ open, onClose, onConfirmer, apercu, loading, confirming }) {
  const lignes = apercu?.lignes || [];
  const resume = apercu?.resume;
  const aDesErreurs = (resume?.erreurs || 0) > 0;
  const aDesLignesValides = lignes.some((l) => l.statut !== 'erreur');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Aperçu de l'import"
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={confirming}>Annuler</Button>
          <Button onClick={onConfirmer} loading={confirming} disabled={loading || !aDesLignesValides}>
            Confirmer l'import
          </Button>
        </>
      }
    >
      {loading ? (
        <p className="text-center text-gris-doux py-12">Analyse du fichier en cours...</p>
      ) : !lignes.length ? (
        <p className="text-center text-gris-doux py-12">Le fichier ne contient aucune ligne exploitable.</p>
      ) : (
        <>
          {resume && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-blanc-casse text-bleu-nuit text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-vert-medical" /> {resume.total} ligne(s) analysée(s)
              </span>
              {resume.nouveaux_medicaments > 0 && (
                <span className="px-3 py-1.5 rounded-[6px] bg-vert-menthe text-vert-profond text-sm font-medium">
                  {resume.nouveaux_medicaments} nouveau(x) médicament(s)
                </span>
              )}
              {resume.nouveaux_catalogue > 0 && (
                <span className="px-3 py-1.5 rounded-[6px] bg-vert-menthe text-vert-profond text-sm font-medium">
                  {resume.nouveaux_catalogue} ajout(s) au catalogue
                </span>
              )}
              {resume.mises_a_jour > 0 && (
                <span className="px-3 py-1.5 rounded-[6px] bg-[#FFF0E9] text-orange-corail text-sm font-medium">
                  {resume.mises_a_jour} mise(s) à jour
                </span>
              )}
              {resume.erreurs > 0 && (
                <span className="px-3 py-1.5 rounded-[6px] bg-[#FEE2E2] text-danger text-sm font-medium">
                  {resume.erreurs} erreur(s)
                </span>
              )}
            </div>
          )}

          {aDesErreurs && (
            <p className="text-sm text-gris-doux mb-3">
              Les lignes en erreur seront ignorées si vous confirmez l'import ; seules les lignes valides seront enregistrées.
            </p>
          )}

          <div className="overflow-x-auto border border-gris-bordure rounded-[8px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-blanc-casse">
                  <th className="py-2.5 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Ligne</th>
                  <th className="py-2.5 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">CIP</th>
                  <th className="py-2.5 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Médicament</th>
                  <th className="py-2.5 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Qté</th>
                  <th className="py-2.5 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Prix</th>
                  <th className="py-2.5 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Statut</th>
                  <th className="py-2.5 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Détail</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne) => (
                  <tr
                    key={ligne.ligne}
                    className={`border-t border-gris-bordure ${ligne.statut === 'erreur' ? 'bg-[#FEE2E2]/20' : ''}`}
                  >
                    <td className="py-2 px-3 font-mono text-gris-doux">{ligne.ligne}</td>
                    <td className="py-2 px-3 font-mono text-bleu-nuit">{ligne.cip || '—'}</td>
                    <td className="py-2 px-3 text-bleu-nuit">{ligne.designation || '—'}</td>
                    <td className="py-2 px-3 font-mono text-bleu-nuit">{ligne.quantite ?? '—'}</td>
                    <td className="py-2 px-3 font-mono text-bleu-nuit">{ligne.prix_unitaire != null ? formatMontant(ligne.prix_unitaire) : '—'}</td>
                    <td className="py-2 px-3"><Badge statut={ligne.statut} /></td>
                    <td className="py-2 px-3 text-gris-doux text-xs">{ligne.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Modal>
  );
}
