import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../../components/atoms/Card';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useInscrirePharmacie } from '../../hooks/usePharmacies';
import { useGeolocation } from '../../hooks/useGeolocation';
import { geocoderInverse } from '../../utils/geo';
import {
  Building2, Mail, Lock, User, Phone, KeyRound, MapPin, BadgeCheck, Upload, LocateFixed,
} from 'lucide-react';

const FORM_INITIAL = {
  nom: '', prenom: '', email: '', telephone: '', password: '', password_confirmation: '',
  nomPharmacie: '', addresse: '', numTelPharmacie: '', numLicence: '',
};

export default function RegisterPharmacienPage() {
  const [etape, setEtape] = useState('inscription');
  const [form, setForm] = useState(FORM_INITIAL);
  const [document, setDocument] = useState(null);
  const [coords, setCoords] = useState(null);
  const [chargementAdresse, setChargementAdresse] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register, verifyOtp, login } = useAuth();
  const inscrirePharmacie = useInscrirePharmacie();
  const { statut: statutGeoloc, demanderPosition } = useGeolocation();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleDemanderPosition = () => {
    demanderPosition({
      onSuccess: (c) => {
        setCoords(c);
        setErrors((prev) => ({ ...prev, latitude: '', longitude: '' }));
        setChargementAdresse(true);
        geocoderInverse(c.latitude, c.longitude)
          .then((adresseTrouvee) => {
            if (adresseTrouvee) setForm((prev) => ({ ...prev, addresse: adresseTrouvee }));
          })
          .finally(() => setChargementAdresse(false));
      },
    });
  };

  const handleSubmitInscription = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!coords) {
      toast.error('Veuillez renseigner la localisation GPS de votre pharmacie.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(
        { nom: form.nom, prenom: form.prenom, email: form.email, telephone: form.telephone, password: form.password, password_confirmation: form.password_confirmation },
        'pharmacien'
      );
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
        toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOtp({ user_id: userId, otp });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code invalide ou expiré.');
      setLoading(false);
      return;
    }

    try {
      await login({ email: form.email, password: form.password });
    } catch {
      navigate('/login', { state: { message: 'Compte confirmé avec succès. Connectez-vous pour continuer.' } });
      return;
    }

    const formData = new FormData();
    formData.append('nomPharmacie', form.nomPharmacie);
    formData.append('addresse', form.addresse);
    formData.append('numTel', form.numTelPharmacie);
    formData.append('numLicence', form.numLicence);
    formData.append('latitude', coords.latitude);
    formData.append('longitude', coords.longitude);
    if (document) formData.append('documentUpload', document);

    try {
      await inscrirePharmacie.mutateAsync(formData);
      navigate('/pharmacien/catalogue');
    } catch (err) {
      const message = err.response?.data?.message
        || "Votre compte est confirmé, mais l'enregistrement de votre pharmacie a échoué. Complétez le formulaire ci-dessous.";
      navigate('/pharmacien/catalogue', { state: { message } });
    }
  };

  if (etape === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bleu-clair px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-bleu rounded-full mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-noir">SOS-Pharma</h1>
            <p className="text-gris mt-1">Confirmez votre compte</p>
          </div>

          <Card>
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <p className="text-sm text-gris">
                Un code à 6 chiffres a été envoyé à <span className="font-medium text-noir">{form.email}</span>.
                Entrez-le ci-dessous pour confirmer votre compte et finaliser l'inscription de votre pharmacie.
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
                Confirmer et créer ma pharmacie
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bleu-clair px-4 py-8">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-bleu rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-noir">SOS-Pharma</h1>
          <p className="text-gris mt-1">Créer votre compte pharmacie</p>
        </div>

        <Card>
          <form onSubmit={handleSubmitInscription} className="space-y-6">
            <div>
              <h2 className="font-semibold text-noir mb-3">Vos informations (responsable)</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Nom" value={form.nom} onChange={handleChange('nom')} error={errors.nom} icon={<User className="w-4 h-4" />} required />
                  <Input label="Prénom" value={form.prenom} onChange={handleChange('prenom')} error={errors.prenom} icon={<User className="w-4 h-4" />} required />
                </div>
                <Input label="Email" type="email" value={form.email} onChange={handleChange('email')} error={errors.email} icon={<Mail className="w-4 h-4" />} required />
                <Input label="Téléphone personnel" type="tel" value={form.telephone} onChange={handleChange('telephone')} error={errors.telephone} icon={<Phone className="w-4 h-4" />} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Mot de passe" type="password" value={form.password} onChange={handleChange('password')} error={errors.password} icon={<Lock className="w-4 h-4" />} required />
                  <Input label="Confirmer" type="password" value={form.password_confirmation} onChange={handleChange('password_confirmation')} error={errors.password_confirmation} icon={<Lock className="w-4 h-4" />} required />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h2 className="font-semibold text-noir mb-3">Informations de la pharmacie</h2>
              <div className="space-y-4">
                <Input label="Nom de la pharmacie" value={form.nomPharmacie} onChange={handleChange('nomPharmacie')} error={errors.nomPharmacie} icon={<Building2 className="w-4 h-4" />} required />
                <Input label="Adresse" value={form.addresse} onChange={handleChange('addresse')} error={errors.addresse} icon={<MapPin className="w-4 h-4" />} required />

                <div>
                  <Button type="button" variant="outline" size="sm" onClick={handleDemanderPosition} loading={statutGeoloc === 'chargement' || chargementAdresse}>
                    <LocateFixed className="w-3.5 h-3.5" /> Utiliser ma position actuelle
                  </Button>
                  {coords && (
                    <p className="text-xs text-vert mt-1">Position enregistrée ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})</p>
                  )}
                  {statutGeoloc === 'refuse' && (
                    <p className="text-xs text-danger mt-1">Localisation refusée ou indisponible.</p>
                  )}
                </div>

                <Input label="Téléphone de la pharmacie" type="tel" value={form.numTelPharmacie} onChange={handleChange('numTelPharmacie')} error={errors.numTel} icon={<Phone className="w-4 h-4" />} required />
                <Input label="Numéro de licence" value={form.numLicence} onChange={handleChange('numLicence')} error={errors.numLicence} icon={<BadgeCheck className="w-4 h-4" />} required />

                <div>
                  <label className="block text-sm font-medium text-noir mb-1">Document officiel (licence, PDF/JPG/PNG)</label>
                  <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gris cursor-pointer hover:border-bleu">
                    <Upload className="w-4 h-4" />
                    {document ? document.name : 'Choisir un fichier'}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setDocument(e.target.files?.[0] || null)} />
                  </label>
                  {errors.documentUpload && <p className="mt-1 text-xs text-danger">{errors.documentUpload}</p>}
                </div>
              </div>
            </div>

            <p className="text-xs text-gris">
              Votre compte sera en attente de certification par notre équipe après confirmation par code OTP.
            </p>

            <Button type="submit" loading={loading} className="w-full justify-center">
              Créer mon compte pharmacie
            </Button>
          </form>

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
