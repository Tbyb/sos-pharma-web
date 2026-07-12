import { Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Header({ title, onMenuClick, showNotifications = false }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gris-bordure px-4 lg:px-6 py-3 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-vert-menthe rounded-[6px] transition-colors duration-200 cursor-pointer"
      >
        <Menu className="w-5 h-5 text-bleu-nuit" />
      </button>

      <h1 className="text-lg font-medium text-bleu-nuit flex-1">{title}</h1>

      {showNotifications && <NotificationBell />}
    </header>
  );
}
