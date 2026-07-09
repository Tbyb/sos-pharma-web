import { useQuery } from '@tanstack/react-query';
import { getDashboardStatsAPI } from '../api/statistiques.api';

export function useDashboard() {
  return useQuery({
    queryKey: ['statistiques', 'dashboard'],
    queryFn: () => getDashboardStatsAPI().then((res) => res.data),
  });
}
