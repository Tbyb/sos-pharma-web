import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../atoms/Button';
import FormInput from '../atoms/FormInput';
import Card from '../atoms/Card';
import { User, Mail, Phone, Settings, Eye, Lock } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

/**
 * Bloc "Mon profil" partagé par les trois espaces connectés (patient,
 * pharmacien, administrateur) — seul le libellé de rôle affiché change.
 * @param {{ roleLabel: string }} props
 */
export default function ProfilCompte({ roleLabel }) {
  const { user } = useAuth();
  const [onglet, setOnglet] = useState('profil');

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl text-bleu-nuit mb-6">Mon profil</h1>

      <div className="flex gap-2 mb-6 border-b border-gris-bordure">
        <button
          onClick={() => setOnglet('profil')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-200 cursor-pointer ${
            onglet === 'profil'
              ? 'border-vert-medical text-vert-medical'
              : 'border-transparent text-gris-doux hover:text-bleu-nuit'
          }`}
        >
          <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> Mon profil</span>
        </button>
        <button
          onClick={() => setOnglet('parametres')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-200 cursor-pointer ${
            onglet === 'parametres'
              ? 'border-vert-medical text-vert-medical'
              : 'border-transparent text-gris-doux hover:text-bleu-nuit'
          }`}
        >
          <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Paramètres</span>
        </button>
      </div>

      {onglet === 'profil' && <ProfilView user={user} roleLabel={roleLabel} />}
      {onglet === 'parametres' && <ProfilSettings user={user} />}
    </div>
  );
}

function ProfilView({ user, roleLabel }) {
  const initiales = `${(user?.prenom || '')[0] || ''}${(user?.nom || '')[0] || ''}`.toUpperCase();

  return (
    <Card>
      <div className="flex flex-col items-center py-6">
        <div className="relative mb-4">
          {user?.photo ? (
            <img
              src={user.photo}
              alt="Photo de profil"
              className="w-24 h-24 rounded-full object-cover border-4 border-vert-menthe"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-vert-profond flex items-center justify-center border-4 border-vert-menthe">
              <span className="text-2xl font-semibold text-white">{initiales}</span>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold text-bleu-nuit">{user?.prenom} {user?.nom}</h2>
        <p className="text-sm text-gris-doux mt-1">{roleLabel}</p>
      </div>

      <div className="border-t border-gris-bordure pt-4 space-y-4">
        <InfoRow icon={<Mail className="w-4 h-4 text-vert-medical" />} label="Email" value={user?.email} />
        <InfoRow icon={<Phone className="w-4 h-4 text-vert-medical" />} label="Téléphone" value={user?.telephone || 'Non renseigné'} />
        <InfoRow icon={<User className="w-4 h-4 text-vert-medical" />} label="Rôle" value={roleLabel} />
      </div>
    </Card>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="w-8 h-8 rounded-[8px] bg-vert-menthe flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gris-doux">{label}</p>
        <p className="text-sm font-medium text-bleu-nuit">{value}</p>
      </div>
    </div>
  );
}

function ProfilSettings({ user }) {
  const { updateUser } = useAuth();
  const [section, setSection] = useState('infos');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setSection('infos')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors duration-200 ${
            section === 'infos' ? 'bg-vert-medical text-white' : 'bg-blanc-casse text-gris-doux hover:bg-vert-menthe'
          }`}
        >
          Informations personnelles
        </button>
        <button
          onClick={() => setSection('motdepasse')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors duration-200 ${
            section === 'motdepasse' ? 'bg-vert-medical text-white' : 'bg-blanc-casse text-gris-doux hover:bg-vert-menthe'
          }`}
        >
          Mot de passe
        </button>
      </div>

      {section === 'infos' && <InfosForm user={user} updateUser={updateUser} />}
      {section === 'motdepasse' && <MotDePasseForm />}
    </div>
  );
}

function InfosForm({ user, updateUser }) {
  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    telephone: user?.telephone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.put('/profil', form);
      const updatedUser = res.data.data || res.data.user || res.data;
      updateUser(updatedUser);
      toast.success('Profil mis à jour avec succès');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} icon={<User className="w-4 h-4" />} />
          <FormInput label="Nom" name="nom" value={form.nom} onChange={handleChange} icon={<User className="w-4 h-4" />} />
        </div>
        <FormInput
          label="Email"
          type="email"
          value={user?.email || ''}
          icon={<Mail className="w-4 h-4" />}
          disabled
          title="L'email ne peut pas être modifié"
        />
        <FormInput label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} icon={<Phone className="w-4 h-4" />} />
        <Button type="submit" loading={loading} className="w-full justify-center">
          Enregistrer les modifications
        </Button>
      </form>
    </Card>
  );
}

function MotDePasseForm() {
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.put('/profil/mot-de-passe', form);
      toast.success('Mot de passe modifié avec succès');
      setForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Mot de passe actuel"
          name="current_password"
          type="password"
          value={form.current_password}
          onChange={handleChange}
          icon={<Lock className="w-4 h-4" />}
        />
        <FormInput
          label="Nouveau mot de passe"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          icon={<Lock className="w-4 h-4" />}
        />
        <FormInput
          label="Confirmer le nouveau mot de passe"
          name="password_confirmation"
          type="password"
          value={form.password_confirmation}
          onChange={handleChange}
          icon={<Lock className="w-4 h-4" />}
        />
        <Button type="submit" loading={loading} className="w-full justify-center">
          Changer le mot de passe
        </Button>
      </form>
    </Card>
  );
}
