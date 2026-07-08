import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

import PublicLayout from '../components/templates/PublicLayout';
import AdminLayout from '../components/templates/AdminLayout';
import PharmacienLayout from '../components/templates/PharmacienLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

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
        <Route path="/" element={<PlaceholderPage title="Accueil - Recherche médicaments" />} />
        <Route path="/medicaments/:id" element={<PlaceholderPage title="Détail médicament" />} />
        <Route path="/comparaison" element={<PlaceholderPage title="Comparaison des prix" />} />
        <Route path="/pharmacies" element={<PlaceholderPage title="Carte des pharmacies" />} />

        {/* Routes patient (connecté + layout public) */}
        <Route element={<PrivateRoute />}>
          <Route path="/patient/panier" element={<PlaceholderPage title="Mon panier" />} />
          <Route path="/patient/commander" element={<PlaceholderPage title="Passer commande" />} />
          <Route path="/patient/commandes" element={<PlaceholderPage title="Mes commandes" />} />
          <Route path="/patient/profil" element={<PlaceholderPage title="Mon profil" />} />
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
