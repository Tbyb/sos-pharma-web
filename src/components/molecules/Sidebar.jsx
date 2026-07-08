import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Pill, Store, Truck, Package,
  CreditCard, ShoppingCart, LogOut, ShieldPlus, X
} from 'lucide-react';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/medicaments', label: 'Médicaments', icon: Pill },
  { to: '/admin/pharmacies', label: 'Pharmacies', icon: Store },
  { to: '/admin/livreurs', label: 'Livreurs', icon: Truck },
  { to: '/admin/commandes', label: 'Commandes', icon: Package },
  { to: '/admin/transactions', label: 'Transactions', icon: CreditCard },
];

const pharmacienLinks = [
  { to: '/pharmacien/catalogue', label: 'Mon Catalogue', icon: Package },
  { to: '/pharmacien/commandes', label: 'Mes Commandes', icon: ShoppingCart },
  { to: '/pharmacien/pharmacie', label: 'Ma Pharmacie', icon: Store },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin() ? adminLinks : pharmacienLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-vert text-white flex flex-col z-50 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldPlus className="w-7 h-7" />
            <span className="text-lg font-bold">SOS-Pharma</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/10 rounded cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/15 border-l-3 border-white font-medium' : 'hover:bg-white/10'}`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-medium">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="text-sm truncate">
              <p className="font-medium">{user?.prenom} {user?.nom}</p>
              <p className="text-white/60 text-xs">{isAdmin() ? 'Administrateur' : 'Pharmacien'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
