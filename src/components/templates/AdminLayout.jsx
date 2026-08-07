import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../molecules/Sidebar';
import Header from '../molecules/Header';
import { useSidebarCollapse } from '../../hooks/useSidebarCollapse';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/medicaments': 'Référentiel Médicaments',
  '/admin/pharmacies': 'Gestion Pharmacies',
  '/admin/livreurs': 'Gestion Livreurs',
  '/admin/commandes': 'Commandes',
  '/admin/transactions': 'Transactions',
  '/admin/profil': 'Mon profil',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, toggleCollapsed] = useSidebarCollapse();
  const location = useLocation();
  const title = pageTitles[location.pathname]
    || (location.pathname.startsWith('/admin/pharmacies/') ? 'Détail Pharmacie' : null)
    || 'Administration';

  return (
    <div className="min-h-screen bg-blanc-casse">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />

      <div className={`transition-[margin] duration-200 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
