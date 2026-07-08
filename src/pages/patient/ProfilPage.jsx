import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Card from '../../components/atoms/Card';
import Alert from '../../components/atoms/Alert';
import { User, Mail, Phone } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function ProfilPage() {
  const { user, login } = useAuth();

  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axiosInstance.put('/profil', form);
      const updatedUser = res.data.data || res.data.user || res.data;
      login({ ...user, ...updatedUser }, localStorage.getItem('sos_pharma_token'));
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-noir mb-6">Mon profil</h1>

      {message && (
        <Alert variant={message.type} className="mb-4">{message.text}</Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label="Nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              icon={<User className="w-4 h-4" />}
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            icon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Téléphone"
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            icon={<Phone className="w-4 h-4" />}
          />
          <Button type="submit" loading={loading} className="w-full justify-center">
            Enregistrer les modifications
          </Button>
        </form>
      </Card>
    </div>
  );
}
