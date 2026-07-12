import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormInput from '../../components/atoms/FormInput';
import { useAuth } from '../../contexts/AuthContext';
import { useInscrirePharmacie } from '../../hooks/usePharmacies';
import { useGeolocation } from '../../hooks/useGeolocation';
import { geocoderInverse } from '../../utils/geo';
import {
  ShieldPlus, Building2, Mail, Lock, User, Phone, KeyRound, MapPin, BadgeCheck, Upload, LocateFixed,
} from 'lucide-react';

const FORM_INITIAL = {
  nom: '', prenom: '', email: '', telephone: '', password: '', password_confirmation: '',
  nomPharmacie: '', addresse: '', numTelPharmacie: '', numLicence: '',
};

function BoutonSecondaire({ children, loading, ...props }) {
  return (
    <button
      type="button"
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] border border-vert-medical text-vert-medical hover:bg-vert-menthe transition-colors duration-200 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
}

function BoutonPrimaire({ children, loading, ...props }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-[6px] bg-vert-medical hover:bg-vert-profond disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors duration-200"
      {...props}
    >
      {children}
    </button>
  );
}

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
      navigate('/pharmacien/dashboard');
    } catch (err) {
      const message = err.response?.data?.message
        || "Votre compte est confirmé, mais l'enregistrement de votre pharmacie a échoué. Complétez le formulaire ci-dessous.";
      navigate('/pharmacien/dashboard', { state: { message } });
    }
  };

  if (etape === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blanc-casse to-vert-menthe flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-vert-profond font-medium text-lg mb-6">
              <ShieldPlus className="w-6 h-6" />
              SOS-Pharma
            </Link>
            <h1 className="font-display text-3xl text-bleu-nuit mb-1">Confirmez votre compte</h1>
            <p className="text-gris-doux text-sm">Dernière étape avant de créer votre pharmacie</p>
          </div>

          <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-8">
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <p className="text-sm text-gris-doux">
                Un code à 6 chiffres a été envoyé à <span className="font-medium text-bleu-nuit">{form.email}</span>.
                Entrez-le ci-dessous pour confirmer votre compte et finaliser l'inscription de votre pharmacie.
              </p>

              <FormInput
                label="Code de confirmation"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                icon={<KeyRound className="w-4 h-4" />}
                inputMode="numeric"
                maxLength={6}
                required
              />

              <BoutonPrimaire loading={loading || otp.length !== 6}>
                {loading ? 'Confirmation...' : 'Confirmer et créer ma pharmacie'}
              </BoutonPrimaire>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blanc-casse to-vert-menthe flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-vert-profond font-medium text-lg mb-6">
            <ShieldPlus className="w-6 h-6" />
            SOS-Pharma
          </Link>
          <h1 className="font-display text-3xl text-bleu-nuit mb-1">Créer votre compte pharmacie</h1>
          <p className="text-gris-doux text-sm">Rejoignez le réseau de pharmacies certifiées SOS-Pharma</p>
        </div>

        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-8">
          <form onSubmit={handleSubmitInscription} className="space-y-6">
            <div>
              <h2 className="font-medium text-bleu-nuit mb-3">Vos informations (responsable)</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormInput label="Nom" value={form.nom} onChange={handleChange('nom')} error={errors.nom} icon={<User className="w-4 h-4" />} required />
                  <FormInput label="Prénom" value={form.prenom} onChange={handleChange('prenom')} error={errors.prenom} icon={<User className="w-4 h-4" />} required />
                </div>
                <FormInput label="Email" type="email" value={form.email} onChange={handleChange('email')} error={errors.email} icon={<Mail className="w-4 h-4" />} required />
                <FormInput label="Téléphone personnel" type="tel" value={form.telephone} onChange={handleChange('telephone')} error={errors.telephone} icon={<Phone className="w-4 h-4" />} required />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput label="Mot de passe" type="password" value={form.password} onChange={handleChange('password')} error={errors.password} icon={<Lock className="w-4 h-4" />} required />
                  <FormInput label="Confirmer" type="password" value={form.password_confirmation} onChange={handleChange('password_confirmation')} error={errors.password_confirmation} icon={<Lock className="w-4 h-4" />} required />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gris-bordure">
              <h2 className="font-medium text-bleu-nuit mb-3">Informations de la pharmacie</h2>
              <div className="space-y-4">
                <FormInput label="Nom de la pharmacie" value={form.nomPharmacie} onChange={handleChange('nomPharmacie')} error={errors.nomPharmacie} icon={<Building2 className="w-4 h-4" />} required />
                <FormInput label="Adresse" value={form.addresse} onChange={handleChange('addresse')} error={errors.addresse} icon={<MapPin className="w-4 h-4" />} required />

                <div>
                  <BoutonSecondaire onClick={handleDemanderPosition} loading={statutGeoloc === 'chargement' || chargementAdresse}>
                    <LocateFixed className="w-3.5 h-3.5" />
                    {statutGeoloc === 'chargement' || chargementAdresse ? 'Localisation...' : 'Utiliser ma position actuelle'}
                  </BoutonSecondaire>
                  {coords && (
                    <p className="text-xs text-vert-medical mt-1.5">Position enregistrée ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})</p>
                  )}
                  {statutGeoloc === 'refuse' && (
                    <p className="text-xs text-danger mt-1.5">Localisation refusée ou indisponible.</p>
                  )}
                </div>

                <FormInput label="Téléphone de la pharmacie" type="tel" value={form.numTelPharmacie} onChange={handleChange('numTelPharmacie')} error={errors.numTel} icon={<Phone className="w-4 h-4" />} required />
                <FormInput label="Numéro de licence" value={form.numLicence} onChange={handleChange('numLicence')} error={errors.numLicence} icon={<BadgeCheck className="w-4 h-4" />} required />

                <div>
                  <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Document officiel (licence, PDF/JPG/PNG)</label>
                  <label className="flex items-center gap-2 border border-dashed border-gris-bordure rounded-[8px] px-4 py-3 text-sm text-gris-doux cursor-pointer hover:border-vert-medical transition-colors duration-200">
                    <Upload className="w-4 h-4" />
                    {document ? document.name : 'Choisir un fichier'}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setDocument(e.target.files?.[0] || null)} />
                  </label>
                  {errors.documentUpload && <p className="mt-1.5 text-xs text-danger">{errors.documentUpload}</p>}
                </div>
              </div>
            </div>

            <p className="text-xs text-gris-doux">
              Votre compte sera en attente de certification par notre équipe après confirmation par code OTP.
            </p>

            <BoutonPrimaire loading={loading}>
              {loading ? 'Création...' : 'Créer mon compte pharmacie'}
            </BoutonPrimaire>
          </form>

          <p className="text-center text-sm text-gris-doux mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-vert-medical font-medium hover:text-vert-profond transition-colors duration-200">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
