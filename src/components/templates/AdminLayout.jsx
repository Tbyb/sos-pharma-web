import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../molecules/Sidebar';
import Header from '../molecules/Header';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/medicaments': 'Référentiel Médicaments',
  '/admin/pharmacies': 'Gestion Pharmacies',
  '/admin/livreurs': 'Gestion Livreurs',
  '/admin/commandes': 'Commandes',
  '/admin/transactions': 'Transactions',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Administration';

  return (
    <div className="min-h-screen bg-gris-clair">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
