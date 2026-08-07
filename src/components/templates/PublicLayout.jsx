import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldPlus, ShoppingCart, User, LogOut, Package, MapPin, Pill, ChevronDown } from 'lucide-react';
import { usePanier } from '../../contexts/PanierContext';
import Chatbot from '../organisms/Chatbot';
import NotificationBell from '../molecules/NotificationBell';

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/medicaments', label: 'Médicaments' },
  { to: '/pharmacies', label: 'Pharmacies' },
];

export default function PublicLayout() {
  const { isConnecte, user, logout } = useAuth();
  const { nombreItems } = usePanier();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b-2 border-vert-medical sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-vert-profond font-medium text-lg">
            <ShieldPlus className="w-6 h-6" />
            SOS-Pharma
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-bleu-nuit hover:text-vert-medical transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {isConnecte() && (
              <Link
                to="/patient/commandes"
                className="flex items-center gap-1.5 text-bleu-nuit hover:text-vert-medical transition-colors duration-200"
              >
                <Package className="w-4 h-4" />
                Mes commandes
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1">
            <Link to="/medicaments" className="md:hidden p-2 hover:bg-vert-menthe rounded-[6px] transition-colors duration-200" aria-label="Médicaments">
              <Pill className="w-5 h-5 text-bleu-nuit" />
            </Link>
            <Link to="/pharmacies" className="md:hidden p-2 hover:bg-vert-menthe rounded-[6px] transition-colors duration-200" aria-label="Pharmacies">
              <MapPin className="w-5 h-5 text-bleu-nuit" />
            </Link>
            {isConnecte() && (
              <Link to="/patient/commandes" className="md:hidden p-2 hover:bg-vert-menthe rounded-[6px] transition-colors duration-200" aria-label="Mes commandes">
                <Package className="w-5 h-5 text-bleu-nuit" />
              </Link>
            )}

            {isConnecte() && <NotificationBell />}

            {isConnecte() && (
              <Link to="/patient/panier" className="relative p-2 hover:bg-vert-menthe rounded-[6px] transition-colors duration-200">
                <ShoppingCart className="w-5 h-5 text-bleu-nuit" />
                {nombreItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-corail text-white text-xs rounded-full flex items-center justify-center">
                    {nombreItems}
                  </span>
                )}
              </Link>
            )}

            {isConnecte() ? (
              <div className="relative ml-2" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] hover:bg-vert-menthe transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-vert-profond text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                  </div>
                  <span className="text-sm font-medium text-bleu-nuit hidden sm:block">{user?.prenom}</span>
                  <ChevronDown className={`w-4 h-4 text-gris-doux transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gris-bordure py-1 z-50 animate-[scale-in_0.12s_ease-out]">
                    <Link to="/patient/profil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-bleu-nuit hover:bg-vert-menthe transition-colors duration-200">
                      <User className="w-4 h-4" />
                      Mon profil
                    </Link>
                    <hr className="my-1 border-gris-bordure" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-red-50 transition-colors duration-200 cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="ml-2 px-4 py-2 bg-vert-medical hover:bg-vert-profond text-white text-sm font-medium rounded-[6px] transition-colors duration-200">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gris-bordure py-6 text-center text-sm text-gris-doux">
        <p className="mb-1">Recherchez, comparez les prix et localisez la pharmacie certifiée la plus proche de vous à Dakar.</p>
        <p>© 2026 SOS-Pharma. Tous droits réservés.</p>
      </footer>

      <Chatbot />
    </div>
  );
}
