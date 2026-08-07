import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Pill, Store, Truck, Package,
  CreditCard, ShoppingCart, LogOut, ShieldPlus, X, ChevronLeft, ChevronRight
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
  { to: '/pharmacien/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pharmacien/catalogue', label: 'Mon Catalogue', icon: Package },
  { to: '/pharmacien/commandes', label: 'Mes Commandes', icon: ShoppingCart },
  { to: '/pharmacien/pharmacie', label: 'Ma Pharmacie', icon: Store },
];

export default function Sidebar({ open, onClose, collapsed, onToggleCollapsed }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const estAdmin = isAdmin();
  const links = estAdmin ? adminLinks : pharmacienLinks;
  const profilPath = estAdmin ? '/admin/profil' : '/pharmacien/profil';
  // DESIGN.md : sidebar admin = vert profond, sidebar pharmacien = bleu nuit
  const fond = estAdmin ? 'bg-vert-profond' : 'bg-bleu-nuit';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 ${collapsed ? 'lg:w-20' : 'lg:w-64'} ${fond} text-white flex flex-col z-50 transition-transform lg:transition-[width] duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className={`flex items-center justify-between border-b border-white/10 ${collapsed ? 'lg:justify-center lg:px-3 p-6' : 'p-6'}`}>
          <div className="flex items-center gap-2">
            <ShieldPlus className="w-7 h-7 shrink-0" />
            <span className={`text-lg font-medium ${collapsed ? 'lg:hidden' : ''}`}>SOS-Pharma</span>
          </div>
          {!collapsed && (
            <button
              onClick={onToggleCollapsed}
              title="Réduire le menu"
              className="hidden lg:flex p-1 hover:bg-white/10 rounded-[6px] transition-colors duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/10 rounded-[6px] transition-colors duration-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm transition-colors duration-200 ${collapsed ? 'lg:justify-center lg:px-2' : ''} ${
                  isActive
                    ? 'bg-white/15 border-l-[3px] border-white font-medium text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {collapsed && (
          <button
            onClick={onToggleCollapsed}
            title="Développer le menu"
            className="hidden lg:flex items-center justify-center mx-auto mb-2 w-9 h-9 rounded-[6px] text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div className="p-4 border-t border-white/20">
          <Link
            to={profilPath}
            onClick={onClose}
            title="Voir mon profil"
            className={`flex items-center gap-3 mb-3 px-2 py-1.5 -mx-2 rounded-[6px] hover:bg-white/10 transition-colors duration-200 ${collapsed ? 'lg:justify-center lg:px-0 lg:mx-0' : ''}`}
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className={`text-sm truncate ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="font-medium">{user?.prenom} {user?.nom}</p>
              <p className="text-white/60 text-xs">{estAdmin ? 'Administrateur' : 'Pharmacien'}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title={collapsed ? 'Déconnexion' : undefined}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[6px] text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
