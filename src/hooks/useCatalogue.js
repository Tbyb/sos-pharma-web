import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCatalogueAPI, ajouterMedicamentCatalogueAPI, modifierCatalogueAPI,
  toggleDisponibiliteAPI, retirerCatalogueAPI, importerCatalogueAPI, apercuImportCatalogueAPI,
} from '../api/catalogue.api';

export function useCatalogue() {
  return useQuery({
    queryKey: ['ma-pharmacie', 'catalogue'],
    queryFn: () => getCatalogueAPI().then((res) => res.data),
  });
}

function useCatalogueMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ma-pharmacie', 'catalogue'] }),
  });
}

export function useAjouterMedicament() {
  return useCatalogueMutation((data) => ajouterMedicamentCatalogueAPI(data).then((res) => res.data));
}

export function useModifierCatalogue() {
  return useCatalogueMutation(({ id, data }) => modifierCatalogueAPI(id, data).then((res) => res.data));
}

export function useToggleDisponibilite() {
  return useCatalogueMutation(({ id, disponible }) => toggleDisponibiliteAPI(id, disponible).then((res) => res.data));
}

export function useRetirerCatalogue() {
  return useCatalogueMutation((id) => retirerCatalogueAPI(id).then((res) => res.data));
}

export function useImporterCatalogue() {
  return useCatalogueMutation((fichier) => importerCatalogueAPI(fichier).then((res) => res.data));
}

// Prévisualisation : ne modifie rien côté serveur, donc pas besoin d'invalider le cache.
export function useApercuImportCatalogue() {
  return useMutation({
    mutationFn: (fichier) => apercuImportCatalogueAPI(fichier).then((res) => res.data),
  });
}
