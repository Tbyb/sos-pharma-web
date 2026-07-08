import { Link } from 'react-router-dom';
import Card from '../../components/atoms/Card';
import RegisterForm from '../../components/molecules/RegisterForm';
import { ShieldPlus } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-vert-clair px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-vert rounded-full mb-4">
            <ShieldPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-noir">SOS-Pharma</h1>
          <p className="text-gris mt-1">Créer votre compte patient</p>
        </div>

        <Card>
          <RegisterForm />

          <p className="text-center text-sm text-gris mt-4">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-bleu font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
