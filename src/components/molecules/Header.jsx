import { Menu } from 'lucide-react';

export default function Header({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b px-4 lg:px-6 py-3 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gris-clair rounded-lg cursor-pointer"
      >
        <Menu className="w-5 h-5 text-noir" />
      </button>

      <h1 className="text-lg font-semibold text-noir">{title}</h1>
    </header>
  );
}
