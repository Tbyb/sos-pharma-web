import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const role = await login({ email, password });

      if (role === 'administrateur') navigate('/admin/dashboard');
      else if (role === 'pharmacien') navigate('/pharmacien/catalogue');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        label="Email"
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-4 h-4" />}
        required
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        required
      />

      <Button type="submit" loading={loading} className="w-full">
        Se connecter
      </Button>
    </form>
  );
}
