import Card from '../atoms/Card';

/**
 * @param {{ icon: React.ElementType, label: string, valeur: string|number, sousTexte?: string, couleur?: string }} props
 */
export default function StatCard({ icon: Icon, label, valeur, sousTexte, couleur = '#1B8A4C' }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gris">{label}</p>
          <p className="text-2xl font-bold text-noir mt-1">{valeur}</p>
        </div>
        <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${couleur}1A` }}>
          <Icon className="w-5 h-5" style={{ color: couleur }} />
        </div>
      </div>

      {sousTexte && <p className="text-xs text-gris mt-3">{sousTexte}</p>}
    </Card>
  );
}
