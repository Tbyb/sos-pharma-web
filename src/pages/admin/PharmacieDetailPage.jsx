import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, BadgeCheck } from 'lucide-react';
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
import Modal from '../../components/atoms/Modal';
import { STATUTS_PHARMACIE, STATUTS_COMMANDE } from '../../utils/constants';
import { formatMontant, formatDate } from '../../utils/formatters';
import { PHARMACIE_ACTIONS } from '../../utils/pharmacieActions';

export default function PharmacieDetailPage() {
  const { id } = useParams();
  const [action, setAction] = useState(null);
  const [message, setMessage] = useState(null);

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

  const confirmerAction = () => {
    if (!action) return;
    mutations[action].mutate(pharmacie.id, {
      onSuccess: () => setMessage({ type: 'success', text: PHARMACIE_ACTIONS[action].succes }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Une erreur est survenue.' }),
      onSettled: () => setAction(null),
    });
  };

  return (
    <div>
      <Link to="/admin/pharmacies" className="inline-flex items-center gap-1 text-sm text-gris hover:text-noir mb-4">
        <ArrowLeft className="w-4 h-4" /> Retour à la liste
      </Link>

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}

      <Card className="mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-noir">{pharmacie.nomPharmacie}</h1>
            <div className="flex items-center gap-1 mt-2 text-sm text-gris">
              <MapPin className="w-4 h-4" /> {pharmacie.addresse}
            </div>
            {pharmacie.numTel && (
              <div className="flex items-center gap-1 mt-1 text-sm text-gris">
                <Phone className="w-4 h-4" /> {pharmacie.numTel}
              </div>
            )}
            <div className="flex items-center gap-1 mt-1 text-sm text-gris">
              <BadgeCheck className="w-4 h-4" /> Licence {pharmacie.numLicence}
            </div>
          </div>
          <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
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
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold text-noir mb-4">Catalogue ({catalogue.length})</h2>
        {loadingCatalogue ? (
          <Skeleton height="120px" />
        ) : catalogue.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gris border-b">
                  <th className="py-2 px-3 font-medium">Médicament</th>
                  <th className="py-2 px-3 font-medium">Prix unitaire</th>
                  <th className="py-2 px-3 font-medium">Quantité</th>
                  <th className="py-2 px-3 font-medium">Disponible</th>
                </tr>
              </thead>
              <tbody>
                {catalogue.map((stock) => (
                  <tr key={stock.id} className="border-b last:border-0">
                    <td className="py-2 px-3 text-noir">{stock.medicament?.designation}</td>
                    <td className="py-2 px-3">{formatMontant(stock.prix_unitaire)}</td>
                    <td className="py-2 px-3">{stock.quantite}</td>
                    <td className="py-2 px-3">
                      {stock.disponible
                        ? <Badge couleur="#16A34A" fond="#DCFCE7">Disponible</Badge>
                        : <Badge couleur="#6B7280" fond="#F3F4F6">Indisponible</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gris py-6 text-center">Aucun médicament dans le catalogue.</p>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold text-noir mb-4">Commandes récentes</h2>
        {loadingCommandes ? (
          <Skeleton height="120px" />
        ) : commandes.length ? (
          <div className="space-y-2">
            {commandes.map((commande) => {
              const statutCommande = STATUTS_COMMANDE[commande.statut_commande] || { label: commande.statut_commande, couleur: '#6B7280', fond: '#F3F4F6' };
              return (
                <div key={commande.id} className="flex items-center justify-between p-3 rounded-lg bg-gris-clair/50">
                  <div>
                    <p className="text-sm font-medium text-noir">Commande #{commande.id}</p>
                    <p className="text-xs text-gris">{formatDate(commande.date_commande)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-noir">{formatMontant(commande.montant_total)}</span>
                    <Badge couleur={statutCommande.couleur} fond={statutCommande.fond}>{statutCommande.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gris py-6 text-center">Aucune commande pour cette pharmacie.</p>
        )}
      </Card>

      <Modal
        open={!!action}
        onClose={() => setAction(null)}
        title={config?.titre}
        footer={
          <>
            <Button variant="ghost" onClick={() => setAction(null)}>Annuler</Button>
            <Button variant={config?.variant} loading={enCours} onClick={confirmerAction}>{config?.confirmLabel}</Button>
          </>
        }
      >
        <p className="text-sm text-gris">{action && config.description(pharmacie)}</p>
      </Modal>
    </div>
  );
}
