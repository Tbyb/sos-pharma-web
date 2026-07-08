import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldPlus, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { usePanier } from '../../contexts/PanierContext';

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
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-vert font-bold text-lg">
            <ShieldPlus className="w-6 h-6" />
            SOS-Pharma
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-noir hover:text-vert transition-colors">Accueil</Link>
            <Link to="/pharmacies" className="text-noir hover:text-vert transition-colors">Pharmacies</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isConnecte() && (
              <Link to="/patient/panier" className="relative p-2 hover:bg-gris-clair rounded-lg">
                <ShoppingCart className="w-5 h-5 text-noir" />
                {nombreItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                    {nombreItems}
                  </span>
                )}
              </Link>
            )}

            {isConnecte() ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gris-clair transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-vert text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                  </div>
                  <span className="text-sm font-medium text-noir hidden sm:block">{user?.prenom}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link to="/patient/profil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-noir hover:bg-gris-clair">
                      <User className="w-4 h-4" />
                      Mon profil
                    </Link>
                    <Link to="/patient/commandes" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-noir hover:bg-gris-clair">
                      <Package className="w-4 h-4" />
                      Mes commandes
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-red-50 cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-bleu text-white text-sm rounded-lg hover:bg-bleu-fonce transition-colors">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-6 text-center text-sm text-gris">
        © 2026 SOS-Pharma. Tous droits réservés.
      </footer>
    </div>
  );
}
