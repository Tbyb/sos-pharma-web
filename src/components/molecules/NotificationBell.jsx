import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications, useMarquerNotificationLue, useMarquerToutesNotificationsLues } from '../../hooks/useNotifications';
import { formatDate } from '../../utils/formatters';

function lienNotification(notification, role) {
  const data = notification.data || {};
  if (data.idCommande) {
    return role === 'pharmacien' ? '/pharmacien/commandes' : `/patient/commandes/${data.idCommande}`;
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
        className="relative p-2 hover:bg-gris-clair rounded-lg cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-noir" />
        {nonLues > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-danger text-white text-xs rounded-full flex items-center justify-center">
            {nonLues > 99 ? '99+' : nonLues}
          </span>
        )}
      </button>

      {ouvert && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-lg border z-50 animate-[scale-in_0.12s_ease-out]">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-noir text-sm">Notifications</h3>
            {nonLues > 0 && (
              <button
                onClick={() => marquerToutLues.mutate()}
                className="flex items-center gap-1 text-xs text-bleu hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!notifications.length ? (
              <p className="text-center text-sm text-gris py-8">Aucune notification.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleClicNotification(notification)}
                  className={`w-full text-left px-4 py-3 border-b last:border-0 hover:bg-gris-clair transition-colors cursor-pointer ${
                    !notification.read_at ? 'bg-bleu-clair/40' : ''
                  }`}
                >
                  <p className="text-sm text-noir">{notification.data?.message}</p>
                  <p className="text-xs text-gris mt-1">{formatDate(notification.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
