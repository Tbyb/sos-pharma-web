import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, Phone, KeyRound } from 'lucide-react';

export default function RegisterForm({ role = 'patient' }) {
  const [etape, setEtape] = useState('inscription');
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', password_confirmation: '' });
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmitInscription = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      const res = await register(form, role);
      setUserId(res.user_id);
      setEtape('otp');
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.entries(err.response.data.errors).forEach(([key, msgs]) => {
          apiErrors[key] = msgs[0];
        });
        setErrors(apiErrors);
      } else {
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOtp({ user_id: userId, otp });
      const message = role === 'pharmacien'
        ? 'Compte confirmé avec succès. Connectez-vous pour renseigner les informations de votre pharmacie.'
        : 'Compte confirmé avec succès. Vous pouvez maintenant vous connecter.';
      navigate('/login', { state: { message } });
    } catch (err) {
      setError(err.response?.data?.message || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  if (etape === 'otp') {
    return (
      <form onSubmit={handleSubmitOtp} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <p className="text-sm text-gris">
          Un code à 6 chiffres a été envoyé à <span className="font-medium text-noir">{form.email}</span>.
          Entrez-le ci-dessous pour confirmer votre compte.
        </p>

        <Input
          label="Code de confirmation"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          icon={<KeyRound className="w-4 h-4" />}
          inputMode="numeric"
          maxLength={6}
          required
        />

        <Button type="submit" loading={loading} className="w-full" disabled={otp.length !== 6}>
          Confirmer mon compte
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmitInscription} className="space-y-4">
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
