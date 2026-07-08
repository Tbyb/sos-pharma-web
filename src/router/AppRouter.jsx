import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

import PublicLayout from '../components/templates/PublicLayout';
import AdminLayout from '../components/templates/AdminLayout';
import PharmacienLayout from '../components/templates/PharmacienLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import HomePage from '../pages/public/HomePage';
import MedicamentDetailPage from '../pages/public/MedicamentDetailPage';
import ComparaisonPrixPage from '../pages/public/ComparaisonPrixPage';
import PharmaciesMapPage from '../pages/public/PharmaciesMapPage';

import PanierPage from '../pages/patient/PanierPage';
import CommandePage from '../pages/patient/CommandePage';
import PaiementPage from '../pages/patient/PaiementPage';
import MesCommandesPage from '../pages/patient/MesCommandesPage';
import CommandeDetailPage from '../pages/patient/CommandeDetailPage';
import ModifierCommandePage from '../pages/patient/ModifierCommandePage';
import ProfilPage from '../pages/patient/ProfilPage';

const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <h2 className="text-xl text-gris">{title}</h2>
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      {/* Auth (sans layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Pages publiques avec PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/medicaments/:id" element={<MedicamentDetailPage />} />
        <Route path="/comparaison" element={<ComparaisonPrixPage />} />
        <Route path="/pharmacies" element={<PharmaciesMapPage />} />

        {/* Routes patient (connecté + layout public) */}
        <Route element={<PrivateRoute />}>
          <Route path="/patient/panier" element={<PanierPage />} />
          <Route path="/patient/commander" element={<CommandePage />} />
          <Route path="/patient/paiement/:id" element={<PaiementPage />} />
          <Route path="/patient/commandes" element={<MesCommandesPage />} />
          <Route path="/patient/commandes/:id" element={<CommandeDetailPage />} />
          <Route path="/patient/commandes/:id/modifier" element={<ModifierCommandePage />} />
          <Route path="/patient/profil" element={<ProfilPage />} />
        </Route>
      </Route>

      {/* Routes admin avec AdminLayout */}
      <Route element={<RoleRoute role="administrateur" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<PlaceholderPage title="Dashboard Admin" />} />
          <Route path="/admin/medicaments" element={<PlaceholderPage title="Référentiel médicaments" />} />
          <Route path="/admin/pharmacies" element={<PlaceholderPage title="Gestion pharmacies" />} />
          <Route path="/admin/pharmacies/:id" element={<PlaceholderPage title="Détail pharmacie" />} />
          <Route path="/admin/livreurs" element={<PlaceholderPage title="Gestion livreurs" />} />
          <Route path="/admin/commandes" element={<PlaceholderPage title="Commandes" />} />
          <Route path="/admin/transactions" element={<PlaceholderPage title="Transactions" />} />
        </Route>
      </Route>

      {/* Routes pharmacien avec PharmacienLayout */}
      <Route element={<RoleRoute role="pharmacien" />}>
        <Route element={<PharmacienLayout />}>
          <Route path="/pharmacien/catalogue" element={<PlaceholderPage title="Mon catalogue" />} />
          <Route path="/pharmacien/commandes" element={<PlaceholderPage title="Mes commandes" />} />
          <Route path="/pharmacien/pharmacie" element={<PlaceholderPage title="Ma pharmacie" />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
