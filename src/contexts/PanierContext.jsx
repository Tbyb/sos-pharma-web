import { createContext, useState, useContext } from 'react';

const PanierContext = createContext(null);

const STORAGE_KEY = 'sos_pharma_panier';

function loadPanier() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { items: [], pharmacieId: null };
  } catch {
    return { items: [], pharmacieId: null };
  }
}

function savePanier(panier) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(panier));
}

export function PanierProvider({ children }) {
  const [panier, setPanier] = useState(loadPanier);

  const ajouterItem = (medicament, pharmacieId, prix) => {
    setPanier((prev) => {
      if (prev.pharmacieId && prev.pharmacieId !== pharmacieId) {
        if (!window.confirm('Votre panier contient des articles d\'une autre pharmacie. Voulez-vous le vider ?')) {
          return prev;
        }
        const nouveau = { items: [{ ...medicament, prix, quantite: 1 }], pharmacieId };
        savePanier(nouveau);
        return nouveau;
      }

      const existant = prev.items.find((i) => i.id === medicament.id);
      let items;
      if (existant) {
        items = prev.items.map((i) =>
          i.id === medicament.id ? { ...i, quantite: i.quantite + 1 } : i
        );
      } else {
        items = [...prev.items, { ...medicament, prix, quantite: 1 }];
      }
      const nouveau = { items, pharmacieId: pharmacieId || prev.pharmacieId };
      savePanier(nouveau);
      return nouveau;
    });
  };

  const retirerItem = (medicamentId) => {
    setPanier((prev) => {
      const items = prev.items.filter((i) => i.id !== medicamentId);
      const nouveau = { items, pharmacieId: items.length ? prev.pharmacieId : null };
      savePanier(nouveau);
      return nouveau;
    });
  };

  const modifierQuantite = (medicamentId, quantite) => {
    if (quantite < 1) return retirerItem(medicamentId);
    setPanier((prev) => {
      const items = prev.items.map((i) =>
        i.id === medicamentId ? { ...i, quantite } : i
      );
      const nouveau = { ...prev, items };
      savePanier(nouveau);
      return nouveau;
    });
  };

  const viderPanier = () => {
    const nouveau = { items: [], pharmacieId: null };
    savePanier(nouveau);
    setPanier(nouveau);
  };

  const total = panier.items.reduce((sum, i) => sum + i.prix * i.quantite, 0);
  const nombreItems = panier.items.reduce((sum, i) => sum + i.quantite, 0);

  return (
    <PanierContext.Provider value={{
      items: panier.items,
      pharmacieId: panier.pharmacieId,
      total,
      nombreItems,
      ajouterItem,
      retirerItem,
      modifierQuantite,
      viderPanier,
    }}>
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const ctx = useContext(PanierContext);
  if (!ctx) throw new Error('usePanier doit être utilisé dans PanierProvider');
  return ctx;
}
