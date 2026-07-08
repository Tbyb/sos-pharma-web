import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, Phone } from 'lucide-react';

export default function RegisterForm() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.entries(err.response.data.errors).forEach(([key, msgs]) => {
          apiErrors[key] = msgs[0];
        });
        setErrors(apiErrors);
      } else {
        setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nom"
          placeholder="Diallo"
          value={form.nom}
          onChange={handleChange('nom')}
          error={errors.nom}
          icon={<User className="w-4 h-4" />}
          required
        />
        <Input
          label="Prénom"
          placeholder="Aminata"
          value={form.prenom}
          onChange={handleChange('prenom')}
          error={errors.prenom}
          icon={<User className="w-4 h-4" />}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="votre@email.com"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
        icon={<Mail className="w-4 h-4" />}
        required
      />

      <Input
        label="Téléphone"
        type="tel"
        placeholder="77 123 45 67"
        value={form.telephone}
        onChange={handleChange('telephone')}
        error={errors.telephone}
        icon={<Phone className="w-4 h-4" />}
        required
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange('password')}
        error={errors.password}
        icon={<Lock className="w-4 h-4" />}
        required
      />

      <Input
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        value={form.password_confirmation}
        onChange={handleChange('password_confirmation')}
        error={errors.password_confirmation}
        icon={<Lock className="w-4 h-4" />}
        required
      />

      <Button type="submit" loading={loading} className="w-full">
        Créer mon compte
      </Button>
    </form>
  );
}
