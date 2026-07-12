import { Link } from 'react-router-dom';
import RegisterForm from '../../components/molecules/RegisterForm';
import { ShieldPlus, Pill, MapPin, Truck, BadgeCheck } from 'lucide-react';

const ATOUTS = [
  { icon: Pill, texte: 'Comparez les prix d\'un médicament entre plusieurs pharmacies en un coup d\'œil.' },
  { icon: MapPin, texte: 'Localisez la pharmacie la plus proche sur une carte interactive.' },
  { icon: Truck, texte: 'Suivez votre commande de la préparation jusqu\'à la livraison.' },
  { icon: BadgeCheck, texte: 'Toutes les pharmacies partenaires sont vérifiées et certifiées.' },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Colonne gauche — identité (desktop uniquement) */}
      <div className="hidden lg:flex lg:w-1/2 bg-vert-profond flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2 text-white font-medium text-lg">
          <ShieldPlus className="w-6 h-6" />
          SOS-Pharma
        </Link>

        <div>
          <p className="font-display text-white text-4xl leading-snug mb-4">
            Rejoignez des milliers
            <br />
            de patients à Dakar.
          </p>
          <p className="text-white/70 text-base max-w-sm">
            Créez votre compte pour comparer les prix, commander et suivre vos médicaments en toute simplicité.
          </p>

          <div className="mt-10 space-y-5 max-w-sm">
            {ATOUTS.map(({ icon: Icon, texte }) => (
              <div key={texte} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
                <p className="text-white/80 text-sm leading-relaxed pt-1.5">{texte}</p>
              </div>
            ))}
          </div>
        </div>

        <blockquote className="border-l-2 border-white/30 pl-4">
          <p className="text-white/80 text-sm italic">
            « La santé est un droit fondamental de tout être humain. »
          </p>
          <cite className="text-white/50 text-xs not-italic">— Organisation mondiale de la santé</cite>
        </blockquote>
      </div>

      {/* Colonne droite — formulaire */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 text-vert-profond font-medium text-lg mb-8">
            <ShieldPlus className="w-6 h-6" />
            SOS-Pharma
          </div>

          <h1 className="text-2xl font-semibold text-bleu-nuit mb-1">Créer un compte</h1>
          <p className="text-gris-doux text-sm mb-8">Inscrivez-vous en tant que patient</p>

          <RegisterForm />

          <p className="text-center text-sm text-gris-doux mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-vert-medical font-medium hover:text-vert-profond transition-colors duration-200">
              Se connecter
            </Link>
          </p>
          <p className="text-center text-sm text-gris-doux mt-2">
            Vous êtes pharmacien ?{' '}
            <Link to="/register-pharmacien" className="text-vert-medical font-medium hover:text-vert-profond transition-colors duration-200">
              Créer un compte pharmacie
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
