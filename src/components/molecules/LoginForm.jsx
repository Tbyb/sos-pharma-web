import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormInput from '../atoms/FormInput';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const role = await login({ email, password });

      if (role === 'administrateur') navigate('/admin/dashboard');
      else if (role === 'pharmacien') navigate('/pharmacien/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Email"
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-4 h-4" />}
        required
      />

      <FormInput
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-[6px] bg-vert-medical hover:bg-vert-profond disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors duration-200"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
