import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

import PublicLayout from '../components/templates/PublicLayout';
import AdminLayout from '../components/templates/AdminLayout';
import PharmacienLayout from '../components/templates/PharmacienLayout';
import Spinner from '../components/atoms/Spinner';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const RegisterPharmacienPage = lazy(() => import('../pages/auth/RegisterPharmacienPage'));

const HomePage = lazy(() => import('../pages/public/HomePage'));
const MedicamentsCataloguePage = lazy(() => import('../pages/public/MedicamentsPage'));
const MedicamentDetailPage = lazy(() => import('../pages/public/MedicamentDetailPage'));
const PharmaciesMapPage = lazy(() => import('../pages/public/PharmaciesMapPage'));

const PanierPage = lazy(() => import('../pages/patient/PanierPage'));
const CommandePage = lazy(() => import('../pages/patient/CommandePage'));
const PaiementPage = lazy(() => import('../pages/patient/PaiementPage'));
const MesCommandesPage = lazy(() => import('../pages/patient/MesCommandesPage'));
const CommandeDetailPage = lazy(() => import('../pages/patient/CommandeDetailPage'));
const ModifierCommandePage = lazy(() => import('../pages/patient/ModifierCommandePage'));
const ProfilPage = lazy(() => import('../pages/patient/ProfilPage'));

const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const MedicamentsPage = lazy(() => import('../pages/admin/MedicamentsPage'));
const PharmaciesPage = lazy(() => import('../pages/admin/PharmaciesPage'));
const PharmacieDetailPage = lazy(() => import('../pages/admin/PharmacieDetailPage'));
const CommandesPage = lazy(() => import('../pages/admin/CommandesPage'));
const LivreursPage = lazy(() => import('../pages/admin/LivreursPage'));
const TransactionsPage = lazy(() => import('../pages/admin/TransactionsPage'));

const CataloguePage = lazy(() => import('../pages/pharmacien/CataloguePage'));
const CommandesPharmaciePage = lazy(() => import('../pages/pharmacien/CommandesPharmaciePage'));
const MaPharmaciePage = lazy(() => import('../pages/pharmacien/MaPharmaciePage'));
const DashboardPharmacienPage = lazy(() => import('../pages/pharmacien/DashboardPage'));

function ChargementPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<ChargementPage />}>
      <Routes>
        {/* Auth (sans layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-pharmacien" element={<RegisterPharmacienPage />} />

        {/* Pages publiques avec PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/medicaments" element={<MedicamentsCataloguePage />} />
          <Route path="/medicaments/:id" element={<MedicamentDetailPage />} />
          <Route path="/comparaison" element={<Navigate to="/medicaments" replace />} />
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
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/medicaments" element={<MedicamentsPage />} />
            <Route path="/admin/pharmacies" element={<PharmaciesPage />} />
            <Route path="/admin/pharmacies/:id" element={<PharmacieDetailPage />} />
            <Route path="/admin/livreurs" element={<LivreursPage />} />
            <Route path="/admin/commandes" element={<CommandesPage />} />
            <Route path="/admin/transactions" element={<TransactionsPage />} />
          </Route>
        </Route>

        {/* Routes pharmacien avec PharmacienLayout */}
        <Route element={<RoleRoute role="pharmacien" />}>
          <Route element={<PharmacienLayout />}>
            <Route path="/pharmacien/dashboard" element={<DashboardPharmacienPage />} />
            <Route path="/pharmacien/catalogue" element={<CataloguePage />} />
            <Route path="/pharmacien/commandes" element={<CommandesPharmaciePage />} />
            <Route path="/pharmacien/pharmacie" element={<MaPharmaciePage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
