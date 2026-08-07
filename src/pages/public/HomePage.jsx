import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pill, Wallet, Store, ShieldCheck, ArrowRight, BadgeCheck, MapPinned, Sparkles } from 'lucide-react';
import { useMedicaments } from '../../hooks/useMedicaments';
import { usePharmacies } from '../../hooks/usePharmacies';
import MedicamentCard from '../../components/molecules/MedicamentCard';
import Skeleton from '../../components/atoms/Skeleton';
import heroAccueil from '../../assets/Accueil.png';

const ETAPES = [
  {
    icon: Pill,
    titre: 'Recherchez',
    description: 'Indiquez le médicament recherché : on repère les pharmacies certifiées qui l\'ont en stock près de chez vous.',
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

  const { data: medicamentsData, isLoading: chargementMedicaments } = useMedicaments();
  const { data: pharmaciesData, isLoading: chargementPharmacies } = usePharmacies();

  const medicamentsPopulaires = (medicamentsData?.data || []).slice(0, 4);
  const suggestions = medicamentsPopulaires.slice(0, 3).map((m) => m.designation);
  const nbPharmacies = pharmaciesData?.data?.length ?? pharmaciesData?.length ?? 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = recherche.trim();
    navigate(q ? `/medicaments?search=${encodeURIComponent(q)}` : '/medicaments');
  };

  const handleSuggestion = (nom) => {
    navigate(`/medicaments?search=${encodeURIComponent(nom)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blanc-casse to-vert-menthe px-4 py-20 md:py-28">
        <img
          src={heroAccueil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 75% 80% at center, #F7FAFC 0%, rgba(247,250,252,0.9) 38%, rgba(232,245,238,0.55) 70%, rgba(232,245,238,0.25) 100%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-[52px] leading-tight text-bleu-nuit mb-4">
            Vos médicaments, au bon prix, près de chez vous
          </h1>
          <p className="text-gris-doux text-lg mb-10 max-w-xl mx-auto">
            Recherchez un médicament, comparez les prix entre pharmacies certifiées et localisez en quelques secondes celle la plus proche de vous à Dakar.
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

          {suggestions.length > 0 && (
            <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-sm">
              <span className="text-gris-doux">Populaire :</span>
              {suggestions.map((nom) => (
                <button
                  key={nom}
                  onClick={() => handleSuggestion(nom)}
                  className="px-3 py-1 rounded-full bg-white/70 hover:bg-white text-bleu-nuit border border-gris-bordure transition-colors duration-200 cursor-pointer"
                >
                  {nom}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Médicaments populaires */}
      {(chargementMedicaments || medicamentsPopulaires.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 pt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl text-bleu-nuit">Médicaments populaires</h2>
              <p className="text-gris-doux mt-1">Les produits les plus recherchés en ce moment.</p>
            </div>
            <button
              onClick={() => navigate('/medicaments')}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-vert-medical hover:text-vert-profond transition-colors duration-200 shrink-0"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {chargementMedicaments ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="card" height="300px" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {medicamentsPopulaires.map((med) => (
                <MedicamentCard key={med.id} medicament={med} />
              ))}
            </div>
          )}
        </section>
      )}

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-vert-menthe text-xs font-medium uppercase tracking-wide mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Réseau certifié
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-white mb-3">
            {chargementPharmacies ? 'Trouvez la pharmacie la plus proche' : `${nbPharmacies} pharmacie${nbPharmacies > 1 ? 's' : ''} certifiée${nbPharmacies > 1 ? 's' : ''} à Dakar`}
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Nous ne collaborons qu'avec des officines agréées, pour garantir l'authenticité de vos médicaments.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-sm text-white/90">
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-vert-menthe" /> Disponibilité en temps réel</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-vert-menthe" /> Prix transparents</span>
            <span className="flex items-center gap-1.5"><MapPinned className="w-4 h-4 text-vert-menthe" /> Localisation GPS précise</span>
          </div>

          <button
            onClick={() => navigate('/pharmacies')}
            className="px-8 py-3.5 rounded-[6px] bg-white text-vert-profond font-medium hover:bg-vert-menthe transition-colors duration-200"
          >
            Explorer la carte
          </button>
        </div>
      </section>
    </div>
  );
}
