import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Clock3, XCircle } from 'lucide-react';
import Sidebar from '../molecules/Sidebar';
import Header from '../molecules/Header';
import Card from '../atoms/Card';
import Alert from '../atoms/Alert';
import Skeleton from '../atoms/Skeleton';
import InscriptionPharmacieForm from '../organisms/InscriptionPharmacieForm';
import { useMaPharmacie } from '../../hooks/usePharmacies';
import { useSidebarCollapse } from '../../hooks/useSidebarCollapse';

const pageTitles = {
  '/pharmacien/dashboard': 'Dashboard',
  '/pharmacien/catalogue': 'Mon Catalogue',
  '/pharmacien/commandes': 'Mes Commandes',
  '/pharmacien/pharmacie': 'Ma Pharmacie',
};

export default function PharmacienLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, toggleCollapsed] = useSidebarCollapse();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Pharmacie';

  const { data, isLoading, isError, error } = useMaPharmacie();
  const pharmacie = data?.data;
  const messageInscription = location.state?.message;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blanc-casse p-6">
        <Skeleton variant="card" height="280px" />
      </div>
    );
  }

  if (isError) {
    if (error?.response?.status === 404 && error?.response?.data?.message?.includes('non inscrite')) {
      return (
        <div className="min-h-screen bg-blanc-casse flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-xl">
            {messageInscription && <Alert variant="error" className="mb-4">{messageInscription}</Alert>}
            <InscriptionPharmacieForm />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-blanc-casse flex items-center justify-center px-4">
        <Alert variant="error" className="max-w-md">
          {error?.response?.data?.message || 'Impossible de charger votre pharmacie.'}
        </Alert>
      </div>
    );
  }

  if (pharmacie?.statut === 'en_attente') {
    return (
      <div className="min-h-screen bg-blanc-casse flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <Clock3 className="w-10 h-10 text-orange-corail mx-auto mb-3" />
          <h1 className="font-semibold text-bleu-nuit mb-2">Demande en cours de certification</h1>
          <p className="text-sm text-gris-doux">
            La pharmacie « {pharmacie.nomPharmacie} » a bien été enregistrée et est en attente de
            vérification par notre équipe. Vous recevrez un email dès que votre compte sera certifié.
          </p>
        </Card>
      </div>
    );
  }

  if (pharmacie?.statut === 'refusee') {
    return (
      <div className="min-h-screen bg-blanc-casse flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <XCircle className="w-10 h-10 text-danger mx-auto mb-3" />
          <h1 className="font-semibold text-bleu-nuit mb-2">Demande de certification refusée</h1>
          <p className="text-sm text-gris-doux mb-3">
            Votre demande pour « {pharmacie.nomPharmacie} » a été refusée.
          </p>
          {pharmacie.motif_refus && (
            <p className="text-sm text-bleu-nuit bg-vert-menthe rounded-[8px] p-3">
              <span className="font-medium">Motif : </span>{pharmacie.motif_refus}
            </p>
          )}
          <p className="text-xs text-gris-doux mt-3">Contactez notre support pour plus d'informations.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blanc-casse">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />

      <div className={`transition-[margin] duration-200 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} showNotifications />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
