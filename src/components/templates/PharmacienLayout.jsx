import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../molecules/Sidebar';
import Header from '../molecules/Header';

const pageTitles = {
  '/pharmacien/catalogue': 'Mon Catalogue',
  '/pharmacien/commandes': 'Mes Commandes',
  '/pharmacien/pharmacie': 'Ma Pharmacie',
};

export default function PharmacienLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Pharmacie';

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
