import { useState } from 'react';
import {
  useCommandesPharmacie, useAccepterCommande, useRefuserCommande, useMarquerPrete,
} from '../../hooks/useCommandes';
import CommandePharmacienCard from '../../components/molecules/CommandePharmacienCard';
import CommandeDetails from '../../components/molecules/CommandeDetails';
import Skeleton from '../../components/atoms/Skeleton';
import Alert from '../../components/atoms/Alert';
import Modal from '../../components/atoms/Modal';
import Textarea from '../../components/atoms/Textarea';
import Button from '../../components/atoms/Button';
import Pagination from '../../components/atoms/Pagination';

const ONGLETS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'acceptee', label: 'Acceptées' },
  { value: 'prete', label: 'Prêtes' },
  { value: '', label: 'Historique' },
];

export default function CommandesPharmaciePage() {
  const [onglet, setOnglet] = useState('en_attente');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [commandeDetail, setCommandeDetail] = useState(null);
  const [refusCommande, setRefusCommande] = useState(null);
  const [motif, setMotif] = useState('');

  const { data, isLoading, isError, error } = useCommandesPharmacie({ statut: onglet || undefined, page });
  const accepter = useAccepterCommande();
  const refuser = useRefuserCommande();
  const marquerPrete = useMarquerPrete();

  const commandes = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.last_page || 1;
  const enCours = accepter.isPending || refuser.isPending || marquerPrete.isPending;

  const changerOnglet = (value) => {
    setOnglet(value);
    setPage(1);
  };

  const handleAccepter = (commande) => {
    accepter.mutate(commande.id, {
      onSuccess: () => setMessage({ type: 'success', text: 'Commande acceptée.' }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || "Erreur lors de l'acceptation." }),
    });
  };

  const handleRefuser = (commande) => {
    setMotif('');
    setRefusCommande(commande);
  };

  const fermerRefus = () => {
    setRefusCommande(null);
    setMotif('');
  };

  const confirmerRefus = () => {
    if (!refusCommande || !motif.trim()) return;
    refuser.mutate({ id: refusCommande.id, motif }, {
      onSuccess: () => setMessage({ type: 'success', text: 'Commande refusée.' }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du refus.' }),
      onSettled: () => fermerRefus(),
    });
  };

  const handleMarquerPrete = (commande) => {
    marquerPrete.mutate(commande.id, {
      onSuccess: () => setMessage({ type: 'success', text: 'Commande marquée comme prête.' }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour.' }),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-noir mb-6">Mes commandes</h1>

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}
      {isError && (
        <Alert variant="error" className="mb-4">
          {error?.response?.data?.message || 'Impossible de charger les commandes.'}
        </Alert>
      )}

      <div className="flex gap-1 bg-gris-clair rounded-lg p-1 mb-4 w-fit">
        {ONGLETS.map((o) => (
          <button
            key={o.label}
            onClick={() => changerOnglet(o.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${
              onglet === o.value ? 'bg-white text-noir shadow-sm' : 'text-gris hover:text-noir'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" height="180px" />
          ))}
        </div>
      ) : !isError && !commandes.length ? (
        <p className="text-center text-gris py-12">Aucune commande dans cette catégorie.</p>
      ) : !isError ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commandes.map((commande) => (
              <CommandePharmacienCard
                key={commande.id}
                commande={commande}
                onAccepter={handleAccepter}
                onRefuser={handleRefuser}
                onMarquerPrete={handleMarquerPrete}
                onVoirDetails={setCommandeDetail}
                loading={enCours}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination currentPage={meta.current_page || page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      ) : null}

      <Modal open={!!commandeDetail} onClose={() => setCommandeDetail(null)} title="Détail de la commande">
        {commandeDetail && <CommandeDetails commande={commandeDetail} />}
      </Modal>

      <Modal
        open={!!refusCommande}
        onClose={fermerRefus}
        title="Refuser la commande"
        footer={
          <>
            <Button variant="ghost" onClick={fermerRefus}>Annuler</Button>
            <Button variant="danger" loading={refuser.isPending} disabled={!motif.trim()} onClick={confirmerRefus}>
              Refuser
            </Button>
          </>
        }
      >
        <p className="text-sm text-gris">
          {refusCommande && `Refuser la commande #${refusCommande.id} ? Le patient sera notifié du motif.`}
        </p>
        <Textarea
          className="mt-3"
          label="Motif du refus"
          placeholder="Ex: médicament indisponible, rupture de stock..."
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          rows={3}
        />
      </Modal>
    </div>
  );
}
