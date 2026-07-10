import { useState } from 'react';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import { useGeolocation } from '../../hooks/useGeolocation';
import { geocoderInverse } from '../../utils/geo';
import { useInscrirePharmacie } from '../../hooks/usePharmacies';
import { Building2, MapPin, Phone, BadgeCheck, Upload, LocateFixed } from 'lucide-react';

export default function InscriptionPharmacieForm() {
  const [form, setForm] = useState({ nomPharmacie: '', addresse: '', numTel: '', numLicence: '' });
  const [document, setDocument] = useState(null);
  const [coords, setCoords] = useState(null);
  const [chargementAdresse, setChargementAdresse] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const { statut: statutGeoloc, demanderPosition } = useGeolocation();
  const inscrire = useInscrirePharmacie();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    if (!coords) {
      setError('Veuillez renseigner la localisation GPS de votre pharmacie.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append('latitude', coords.latitude);
    formData.append('longitude', coords.longitude);
    if (document) formData.append('documentUpload', document);

    try {
      await inscrire.mutateAsync(formData);
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.entries(err.response.data.errors).forEach(([key, msgs]) => {
          apiErrors[key] = msgs[0];
        });
        setErrors(apiErrors);
      } else {
        setError(err.response?.data?.message || "Erreur lors de l'inscription de la pharmacie");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <h1 className="text-xl font-bold text-noir mb-1">Inscrire votre pharmacie</h1>
        <p className="text-sm text-gris mb-6">
          Renseignez les informations officielles de votre pharmacie. Votre compte sera en attente
          de certification par notre équipe avant de pouvoir recevoir des commandes.
        </p>

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom de la pharmacie"
            value={form.nomPharmacie}
            onChange={handleChange('nomPharmacie')}
            error={errors.nomPharmacie}
            icon={<Building2 className="w-4 h-4" />}
            required
          />

          <Input
            label="Adresse"
            value={form.addresse}
            onChange={handleChange('addresse')}
            error={errors.addresse}
            icon={<MapPin className="w-4 h-4" />}
            required
          />

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemanderPosition}
              loading={statutGeoloc === 'chargement' || chargementAdresse}
            >
              <LocateFixed className="w-3.5 h-3.5" /> Utiliser ma position actuelle
            </Button>
            {coords && (
              <p className="text-xs text-vert mt-1">Position enregistrée ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})</p>
            )}
            {statutGeoloc === 'refuse' && (
              <p className="text-xs text-danger mt-1">Localisation refusée ou indisponible.</p>
            )}
          </div>

          <Input
            label="Téléphone"
            type="tel"
            value={form.numTel}
            onChange={handleChange('numTel')}
            error={errors.numTel}
            icon={<Phone className="w-4 h-4" />}
            required
          />

          <Input
            label="Numéro de licence"
            value={form.numLicence}
            onChange={handleChange('numLicence')}
            error={errors.numLicence}
            icon={<BadgeCheck className="w-4 h-4" />}
            required
          />

          <div>
            <label className="block text-sm font-medium text-noir mb-1">Document officiel (licence, PDF/JPG/PNG)</label>
            <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gris cursor-pointer hover:border-bleu">
              <Upload className="w-4 h-4" />
              {document ? document.name : 'Choisir un fichier'}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setDocument(e.target.files?.[0] || null)}
              />
            </label>
            {errors.documentUpload && <p className="mt-1 text-xs text-danger">{errors.documentUpload}</p>}
          </div>

          <Button type="submit" loading={inscrire.isPending} className="w-full justify-center">
            Soumettre pour certification
          </Button>
        </form>
      </Card>
    </div>
  );
}
