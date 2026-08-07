import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, AlertTriangle, TriangleAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications, useMarquerNotificationLue, useMarquerToutesNotificationsLues } from '../../hooks/useNotifications';
import { formatDate } from '../../utils/formatters';

function IconeNotification({ data }) {
  if (data.idStock) {
    const critique = data.niveau === 'critique';
    return (
      <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${critique ? 'bg-[#FEE2E2] text-danger' : 'bg-[#FFF0E9] text-orange-corail'}`}>
        {critique ? <AlertTriangle className="w-4 h-4" /> : <TriangleAlert className="w-4 h-4" />}
      </span>
    );
  }
  return (
    <span className="shrink-0 w-8 h-8 rounded-full bg-vert-menthe text-vert-profond flex items-center justify-center">
      <Bell className="w-4 h-4" />
    </span>
  );
}

function lienNotification(notification, role) {
  const data = notification.data || {};
  if (data.idStock) {
    return '/pharmacien/catalogue';
  }
  if (data.idCommande) {
    return role === 'pharmacien'
      ? `/pharmacien/commandes?commande=${data.idCommande}`
      : `/patient/commandes/${data.idCommande}`;
  }
  if (data.idPharmacie) {
    return '/pharmacien/pharmacie';
  }
  return null;
}

export default function NotificationBell() {
  const [ouvert, setOuvert] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data } = useNotifications();
  const marquerLue = useMarquerNotificationLue();
  const marquerToutLues = useMarquerToutesNotificationsLues();

  const notifications = data?.data || [];
  const nonLues = data?.meta?.non_lues || 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOuvert(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClicNotification = (notification) => {
    if (!notification.read_at) marquerLue.mutate(notification.id);
    const lien = lienNotification(notification, user?.role);
    setOuvert(false);
    if (lien) navigate(lien);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOuvert((v) => !v)}
        className="relative p-2 hover:bg-vert-menthe rounded-[6px] transition-colors duration-200 cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-bleu-nuit" />
        {nonLues > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-danger text-white text-xs rounded-full flex items-center justify-center">
            {nonLues > 99 ? '99+' : nonLues}
          </span>
        )}
      </button>

      {ouvert && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gris-bordure z-50 animate-[scale-in_0.12s_ease-out]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gris-bordure">
            <h3 className="font-medium text-bleu-nuit text-sm">Notifications</h3>
            {nonLues > 0 && (
              <button
                onClick={() => marquerToutLues.mutate()}
                className="flex items-center gap-1 text-xs text-vert-medical hover:text-vert-profond transition-colors duration-200 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!notifications.length ? (
              <p className="text-center text-sm text-gris-doux py-8">Aucune notification.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleClicNotification(notification)}
                  className={`w-full flex items-start gap-3 text-left px-4 py-3 border-b border-gris-bordure last:border-0 hover:bg-blanc-casse transition-colors duration-200 cursor-pointer ${
                    !notification.read_at ? 'bg-vert-menthe/40' : ''
                  }`}
                >
                  <IconeNotification data={notification.data || {}} />
                  <span className="min-w-0">
                    <p className="text-sm text-bleu-nuit">{notification.data?.message}</p>
                    <p className="text-xs text-gris-doux mt-1">{formatDate(notification.created_at)}</p>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
