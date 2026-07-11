import { useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Phone, BadgeCheck } from 'lucide-react';
import { useMaPharmacie, useModifierMaPharmacie } from '../../hooks/usePharmacies';
import Card from '../../components/atoms/Card';
import Badge from '../../components/atoms/Badge';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import Alert from '../../components/atoms/Alert';
import Skeleton from '../../components/atoms/Skeleton';
import { STATUTS_PHARMACIE } from '../../utils/constants';

export default function MaPharmaciePage() {
  const { data, isLoading, isError, error } = useMaPharmacie();
  const pharmacie = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton variant="card" height="140px" />
        <Skeleton variant="card" height="280px" />
      </div>
    );
  }

  if (isError || !pharmacie) {
    return (
      <Alert variant="error">
        {error?.response?.data?.message || 'Impossible de charger votre pharmacie.'}
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-noir mb-6">Ma pharmacie</h1>
      <InfosPharmacie pharmacie={pharmacie} />
    </div>
  );
}

function InfosPharmacie({ pharmacie }) {
  const modifier = useModifierMaPharmacie();
  const [form, setForm] = useState({
    nomPharmacie: pharmacie.nomPharmacie || '',
    addresse: pharmacie.addresse || '',
    numTel: pharmacie.numTel || '',
    latitude: pharmacie.latitude || '',
    longitude: pharmacie.longitude || '',
  });
  const statut = STATUTS_PHARMACIE[pharmacie.statut] || { label: pharmacie.statut, couleur: '#6B7280', fond: '#F3F4F6' };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    modifier.mutate(form, {
      onSuccess: () => toast.success('Informations mises à jour.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Une erreur est survenue.'),
    });
  };

  return (
    <>
      <Card className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-noir">{pharmacie.nomPharmacie}</h2>
            <div className="flex items-center gap-1 mt-2 text-sm text-gris">
              <MapPin className="w-4 h-4" /> {pharmacie.addresse}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-gris">
              <Phone className="w-4 h-4" /> {pharmacie.numTel}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-gris">
              <BadgeCheck className="w-4 h-4" /> Licence {pharmacie.numLicence}
            </div>
          </div>
          <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-noir mb-4">Modifier les informations</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nom de la pharmacie" name="nomPharmacie" value={form.nomPharmacie} onChange={handleChange} />
          <Input label="Adresse" name="addresse" value={form.addresse} onChange={handleChange} />
          <Input label="Téléphone" name="numTel" value={form.numTel} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} />
            <Input label="Longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} />
          </div>
          <Button type="submit" loading={modifier.isPending} className="w-full justify-center">
            Enregistrer les modifications
          </Button>
        </form>
      </Card>
    </>
  );
}
