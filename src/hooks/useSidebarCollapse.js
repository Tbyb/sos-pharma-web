import { useState } from 'react';

const STORAGE_KEY = 'sos-pharma:sidebar-collapsed';

export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      return next;
    });
  };

  return [collapsed, toggle];
}
