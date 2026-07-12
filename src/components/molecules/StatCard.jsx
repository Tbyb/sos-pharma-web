const VARIANTS = {
  vert: { bg: '#E8F5EE', icon: '#0A5C36' },
  bleu: { bg: '#E3F2FD', icon: '#1A3A5C' },
};

/**
 * @param {{ icon: React.ElementType, label: string, valeur: string|number, sousTexte?: string, variant?: 'vert'|'bleu' }} props
 */
export default function StatCard({ icon: Icon, label, valeur, sousTexte, variant = 'vert' }) {
  const { bg, icon } = VARIANTS[variant] || VARIANTS.vert;

  return (
    <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-gris-doux">{label}</p>
          <p className="font-mono text-[28px] font-bold text-bleu-nuit mt-1 leading-tight">{valeur}</p>
        </div>
        <div className="w-11 h-11 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
          <Icon className="w-5 h-5" style={{ color: icon }} />
        </div>
      </div>

      {sousTexte && <p className="text-xs text-gris-doux mt-3">{sousTexte}</p>}
    </div>
  );
}
