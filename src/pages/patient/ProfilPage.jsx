import ProfilCompte from '../../components/organisms/ProfilCompte';

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-blanc-casse">
      <div className="px-4 py-8">
        <ProfilCompte roleLabel="Patient" />
      </div>
    </div>
  );
}
