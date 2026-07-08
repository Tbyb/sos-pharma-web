import { Link } from 'react-router-dom';
import Card from '../../components/atoms/Card';
import LoginForm from '../../components/molecules/LoginForm';
import { ShieldPlus } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-vert-clair px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-vert rounded-full mb-4">
            <ShieldPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-noir">SOS-Pharma</h1>
          <p className="text-gris mt-1">Connectez-vous à votre compte</p>
        </div>

        <Card>
          <LoginForm />

          <p className="text-center text-sm text-gris mt-4">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-bleu font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
