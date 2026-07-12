import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Phone, BadgeCheck, FileText } from 'lucide-react';
import {
  usePharmacieDetail, usePharmacieCatalogue,
  useAccepterPharmacie, useRefuserPharmacie, useSuspendrePharmacie, useReactiverPharmacie,
} from '../../hooks/usePharmacies';
import { useAdminCommandes } from '../../hooks/useCommandes';
import Card from '../../components/atoms/Card';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import Skeleton from '../../components/atoms/Skeleton';
import Alert from '../../components/atoms/Alert';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import { STATUTS_PHARMACIE, STATUTS_COMMANDE } from '../../utils/constants';
import { formatMontant, formatDate } from '../../utils/formatters';
import { PHARMACIE_ACTIONS } from '../../utils/pharmacieActions';
import { getStorageUrl } from '../../utils/storage';

export default function PharmacieDetailPage() {
  const { id } = useParams();
  const [action, setAction] = useState(null);
  const [motif, setMotif] = useState('');

  const { data, isLoading } = usePharmacieDetail(id);
  const { data: catalogueRes, isLoading: loadingCatalogue } = usePharmacieCatalogue(id);
  const { data: commandesRes, isLoading: loadingCommandes } = useAdminCommandes({ idPharmacie: id });

  const certifier = useAccepterPharmacie();
  const refuser = useRefuserPharmacie();
  const suspendre = useSuspendrePharmacie();
  const reactiver = useReactiverPharmacie();
  const mutations = { certifier, refuser, suspendre, reactiver };

  const pharmacie = data?.data;
  const catalogue = catalogueRes?.data || [];
  const commandes = commandesRes?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton height="32px" width="240px" />
        <Skeleton variant="card" height="160px" />
        <Skeleton variant="card" height="240px" />
      </div>
    );
  }

  if (!pharmacie) {
    return <Alert variant="error">Pharmacie introuvable.</Alert>;
  }

  const statut = STATUTS_PHARMACIE[pharmacie.statut] || { label: pharmacie.statut, couleur: '#6B7280', fond: '#F3F4F6' };
  const config = action ? PHARMACIE_ACTIONS[action] : null;
  const enCours = action ? mutations[action].isPending : false;

  const fermerConfirmation = () => {
    setAction(null);
    setMotif('');
  };

  const confirmerAction = () => {
    if (!action) return;
    const variables = action === 'refuser' ? { id: pharmacie.id, motif } : pharmacie.id;
    mutations[action].mutate(variables, {
      onSuccess: () => toast.success(PHARMACIE_ACTIONS[action].succes),
      onError: (err) => toast.error(err.response?.data?.message || 'Une erreur est survenue.'),
      onSettled: () => fermerConfirmation(),
    });
  };

  return (
    <div>
      <Link to="/admin/pharmacies" className="inline-flex items-center gap-1 text-sm text-gris-doux hover:text-vert-medical transition-colors duration-200 mb-4">
        <ArrowLeft className="w-4 h-4" /> Retour à la liste
      </Link>

      <Card className="mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-bleu-nuit">{pharmacie.nomPharmacie}</h1>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-gris-doux">
              <MapPin className="w-4 h-4" /> {pharmacie.addresse}
            </div>
            {pharmacie.numTel && (
              <div className="flex items-center gap-1.5 mt-1 text-sm text-gris-doux font-mono">
                <Phone className="w-4 h-4" /> {pharmacie.numTel}
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-1 text-sm text-gris-doux font-mono">
              <BadgeCheck className="w-4 h-4" /> Licence {pharmacie.numLicence}
            </div>
            {pharmacie.documentUpload && (
              <a
                href={getStorageUrl(pharmacie.documentUpload)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 mt-1 text-sm text-vert-medical hover:text-vert-profond transition-colors duration-200 w-fit"
              >
                <FileText className="w-4 h-4" /> Voir le document soumis
              </a>
            )}
          </div>
          <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gris-bordure">
          {pharmacie.statut === 'en_attente' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => setAction('certifier')}>Certifier</Button>
              <Button size="sm" variant="danger" onClick={() => setAction('refuser')}>Refuser</Button>
            </>
          )}
          {pharmacie.statut === 'active' && (
            <Button size="sm" variant="outline" onClick={() => setAction('suspendre')}>Suspendre</Button>
          )}
          {pharmacie.statut === 'suspendue' && (
            <Button size="sm" variant="secondary" onClick={() => setAction('reactiver')}>Réactiver</Button>
          )}
        </div>

        {pharmacie.statut === 'refusee' && pharmacie.motif_refus && (
          <p className="mt-4 pt-4 border-t border-gris-bordure text-sm text-gris-doux">
            <span className="font-medium text-bleu-nuit">Motif du refus : </span>{pharmacie.motif_refus}
          </p>
        )}
      </Card>

      <Card className="mb-4">
        <h2 className="font-medium text-bleu-nuit mb-4">Catalogue ({catalogue.length})</h2>
        {loadingCatalogue ? (
          <Skeleton height="120px" />
        ) : catalogue.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-blanc-casse">
                  <th className="py-2 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Médicament</th>
                  <th className="py-2 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Prix unitaire</th>
                  <th className="py-2 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Quantité</th>
                  <th className="py-2 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Disponible</th>
                </tr>
              </thead>
              <tbody>
                {catalogue.map((stock) => (
                  <tr key={stock.id} className="border-t border-gris-bordure">
                    <td className="py-2 px-3 text-bleu-nuit">{stock.medicament?.designation}</td>
                    <td className="py-2 px-3 font-mono text-bleu-nuit">{formatMontant(stock.prix_unitaire)}</td>
                    <td className="py-2 px-3 font-mono text-gris-doux">{stock.quantite}</td>
                    <td className="py-2 px-3">
                      {stock.disponible
                        ? <Badge couleur="#0A5C36" fond="#E8F5EE">Disponible</Badge>
                        : <Badge couleur="#6B7280" fond="#F3F4F6">Indisponible</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gris-doux py-6 text-center">Aucun médicament dans le catalogue.</p>
        )}
      </Card>

      <Card>
        <h2 className="font-medium text-bleu-nuit mb-4">Commandes récentes</h2>
        {loadingCommandes ? (
          <Skeleton height="120px" />
        ) : commandes.length ? (
          <div className="space-y-2">
            {commandes.map((commande) => {
              const statutCommande = STATUTS_COMMANDE[commande.statut_commande] || { label: commande.statut_commande, couleur: '#6B7280', fond: '#F3F4F6' };
              return (
                <div key={commande.id} className="flex items-center justify-between p-3 rounded-[8px] bg-blanc-casse">
                  <div>
                    <p className="text-sm font-medium text-bleu-nuit">Commande #{commande.id}</p>
                    <p className="text-xs text-gris-doux">{formatDate(commande.date_commande)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-medium text-bleu-nuit">{formatMontant(commande.montant_total)}</span>
                    <Badge couleur={statutCommande.couleur} fond={statutCommande.fond}>{statutCommande.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gris-doux py-6 text-center">Aucune commande pour cette pharmacie.</p>
        )}
      </Card>

      <ConfirmDialog
        open={!!action}
        onClose={fermerConfirmation}
        onConfirm={confirmerAction}
        title={config?.titre}
        description={action && config.description(pharmacie)}
        confirmLabel={config?.confirmLabel}
        variant={config?.variant}
        loading={enCours}
        motif={config?.motifRequis ? motif : undefined}
        onMotifChange={config?.motifRequis ? setMotif : undefined}
        motifLabel="Motif du refus"
        motifPlaceholder="Ex: documents illisibles, licence invalide..."
        motifRequired={config?.motifRequis}
      />
    </div>
  );
}
