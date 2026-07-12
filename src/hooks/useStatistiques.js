import { useQuery } from '@tanstack/react-query';
import { getDashboardStatsAPI, getDashboardPharmacienStatsAPI } from '../api/statistiques.api';

export function useDashboard() {
  return useQuery({
    queryKey: ['statistiques', 'dashboard'],
    queryFn: () => getDashboardStatsAPI().then((res) => res.data),
  });
}

export function useDashboardPharmacien() {
  return useQuery({
    queryKey: ['statistiques', 'dashboard-pharmacien'],
    queryFn: () => getDashboardPharmacienStatsAPI().then((res) => res.data),
  });
}
