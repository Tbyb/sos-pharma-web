import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pill, Wallet, Store, ShieldCheck } from 'lucide-react';

const ETAPES = [
  {
    icon: Pill,
    titre: 'Recherchez',
    description: 'Trouvez votre médicament parmi les pharmacies certifiées de Dakar.',
  },
  {
    icon: Wallet,
    titre: 'Comparez les prix',
    description: 'Visualisez instantanément le meilleur prix disponible près de chez vous.',
  },
  {
    icon: Store,
    titre: 'Choisissez',
    description: 'Retrait en pharmacie ou livraison à domicile, selon votre besoin.',
  },
  {
    icon: ShieldCheck,
    titre: 'Recevez',
    description: 'Récupérez vos médicaments en toute sérénité, au prix annoncé.',
  },
];

export default function HomePage() {
  const [recherche, setRecherche] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = recherche.trim();
    navigate(q ? `/medicaments?search=${encodeURIComponent(q)}` : '/medicaments');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blanc-casse to-vert-menthe px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-[52px] leading-tight text-bleu-nuit mb-4">
            Trouvez vos médicaments au meilleur prix
          </h1>
          <p className="text-gris-doux text-lg mb-10 max-w-xl mx-auto">
            Comparez les prix dans les pharmacies certifiées de Dakar, en quelques secondes.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-vert-medical" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un médicament (ex: Paracétamol, Amoxicilline...)"
                className="w-full pl-14 pr-5 py-4 rounded-[8px] border border-gris-bordure bg-white text-bleu-nuit placeholder:text-gris-doux shadow-[0_4px_16px_rgba(10,92,54,0.08)] outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 rounded-[6px] bg-vert-medical hover:bg-vert-profond text-white font-medium transition-colors duration-200 shrink-0"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl text-bleu-nuit text-center mb-16">Comment ça marche</h2>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-vert-medical" />

          {ETAPES.map(({ icon: Icon, titre, description }) => (
            <div key={titre} className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-vert-menthe ring-8 ring-white flex items-center justify-center mb-5">
                <Icon className="w-7 h-7 text-vert-profond" />
              </div>
              <h3 className="font-medium text-bleu-nuit mb-2">{titre}</h3>
              <p className="text-sm text-gris-doux leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA pharmacies */}
      <section className="bg-vert-profond px-4 py-14">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-white mb-3">
            Trouvez la pharmacie la plus proche
          </h2>
          <p className="text-white/80 mb-8">
            Localisez les pharmacies certifiées autour de vous et vérifiez leurs horaires.
          </p>
          <button
            onClick={() => navigate('/pharmacies')}
            className="px-8 py-3.5 rounded-[6px] bg-white text-vert-profond font-medium hover:bg-vert-menthe transition-colors duration-200"
          >
            Voir les pharmacies
          </button>
        </div>
      </section>
    </div>
  );
}
