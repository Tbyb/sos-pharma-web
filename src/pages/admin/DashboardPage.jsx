import { useDashboard } from '../../hooks/useStatistiques';
import DashboardStats from '../../components/organisms/DashboardStats';
import Alert from '../../components/atoms/Alert';

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isError) {
    return <Alert variant="error">Impossible de charger les statistiques du dashboard.</Alert>;
  }

  return (
    <div>
      <DashboardStats stats={data?.data || {}} isLoading={isLoading} />
    </div>
  );
}
