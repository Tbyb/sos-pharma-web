import { useDashboardPharmacien } from '../../hooks/useStatistiques';
import PharmacienDashboardStats from '../../components/organisms/PharmacienDashboardStats';
import Alert from '../../components/atoms/Alert';

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardPharmacien();

  if (isError) {
    return <Alert variant="error">Impossible de charger les statistiques de votre pharmacie.</Alert>;
  }

  return (
    <div>
      <PharmacienDashboardStats stats={data?.data || {}} isLoading={isLoading} />
    </div>
  );
}
