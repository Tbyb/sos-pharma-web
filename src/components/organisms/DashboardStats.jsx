import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import { Users, Store, Package, CreditCard, Truck } from 'lucide-react';
import Skeleton from '../atoms/Skeleton';
import StatCard from '../molecules/StatCard';
import { STATUTS_COMMANDE } from '../../utils/constants';

// Palette Recharts prescrite par DESIGN.md pour le Dashboard Admin.
const VERT_PROFOND = '#0A5C36';
const VERT_MEDICAL = '#12A05C';
const BLEU_NUIT = '#1A3A5C';
const ORANGE_CORAIL = '#FF6B35';
const GRIS_DOUX = '#6B7280';

function formatJour(date) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: '2-digit' }).format(new Date(date));
}

/**
 * @param {{ stats: object, isLoading: boolean }} props
 */
export default function DashboardStats({ stats = {}, isLoading }) {
  const commandes = stats.commandes || {};
  const pharmacies = stats.pharmacies || {};
  const patients = stats.patients || {};
  const livreurs = stats.livreurs || {};
  const livraisons = stats.livraisons || {};
  const revenus = stats.revenus || {};

  const evolution = (commandes.par_jour || []).map((point) => ({
    jour: formatJour(point.jour),
    total: point.total,
  }));

  const enCours = commandes.en_cours || 0;
  const completees = commandes.completees || 0;
  const annulees = commandes.annulees || 0;
  const autres = Math.max((commandes.total || 0) - enCours - completees - annulees, 0);
  const repartition = [
    { label: STATUTS_COMMANDE.acceptee.label, total: enCours, couleur: BLEU_NUIT },
    { label: STATUTS_COMMANDE.livree.label, total: completees, couleur: VERT_MEDICAL },
    { label: STATUTS_COMMANDE.refusee.label, total: annulees, couleur: ORANGE_CORAIL },
    { label: 'Autres', total: autres, couleur: GRIS_DOUX },
  ].filter((s) => s.total > 0);

  const topPharmacies = (pharmacies.top_5 || []).map((p) => ({
    nom: p.nomPharmacie,
    total: p.total_commandes,
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="card" height="100px" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="card" height="280px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Patients" valeur={patients.total ?? 0} sousTexte={`+${patients.nouveaux_ce_mois ?? 0} ce mois`} variant="bleu" />
        <StatCard icon={Store} label="Total Pharmacies" valeur={pharmacies.total ?? 0} sousTexte={`${pharmacies.actives ?? 0} actives`} variant="vert" />
        <StatCard icon={Truck} label="Total Livreurs" valeur={livreurs.total ?? 0} sousTexte={`${livreurs.actifs ?? 0} actifs • ${livreurs.suspendus ?? 0} suspendu(s)`} variant="bleu" />
        <StatCard icon={Package} label="Commandes" valeur={commandes.total ?? 0} sousTexte={`${enCours} en cours • ${commandes.taux_completion ?? '0%'} complétées`} variant="bleu" />
        <StatCard icon={CreditCard} label="Revenus (ce mois)" valeur={revenus.ce_mois ?? '0 FCFA'} sousTexte={`Total général : ${revenus.total_general ?? '0 FCFA'}`} variant="vert" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-5">
          <h3 className="font-medium text-bleu-nuit mb-4">Évolution des commandes (7 derniers jours)</h3>
          {evolution.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={evolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" />
                <XAxis dataKey="jour" tick={{ fontSize: 12 }} stroke={GRIS_DOUX} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke={GRIS_DOUX} />
                <Tooltip />
                <Line type="monotone" dataKey="total" name="Commandes" stroke={VERT_MEDICAL} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gris-doux py-16 text-center">Aucune commande sur les 7 derniers jours.</p>
          )}
        </div>

        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-5">
          <h3 className="font-medium text-bleu-nuit mb-4">Répartition des commandes</h3>
          {repartition.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={repartition} dataKey="total" nameKey="label" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {repartition.map((entry) => (
                    <Cell key={entry.label} fill={entry.couleur} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gris-doux py-16 text-center">Aucune donnée disponible.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-5">
          <h3 className="font-medium text-bleu-nuit mb-4">Top 5 pharmacies par commandes</h3>
          {topPharmacies.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topPharmacies} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} stroke={GRIS_DOUX} />
                <YAxis type="category" dataKey="nom" tick={{ fontSize: 12 }} stroke={GRIS_DOUX} width={140} />
                <Tooltip />
                <Bar dataKey="total" name="Commandes" radius={[0, 4, 4, 0]}>
                  {topPharmacies.map((entry, index) => (
                    <Cell key={entry.nom} fill={index === 0 ? VERT_PROFOND : VERT_MEDICAL} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gris-doux py-16 text-center">Aucune donnée disponible.</p>
          )}
        </div>

        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-bleu-nuit">Performance des livraisons</h3>
            <span className="font-mono text-sm font-medium text-vert-medical">{livraisons.taux_livraison ?? '0%'}</span>
          </div>
          {livraisons.total ? (
            <div className="space-y-3">
              {[
                { label: STATUTS_COMMANDE.livree.label, valeur: livraisons.livrees ?? 0, couleur: VERT_MEDICAL },
                { label: 'En cours', valeur: livraisons.en_cours ?? 0, couleur: BLEU_NUIT },
                { label: 'En attente', valeur: livraisons.en_attente ?? 0, couleur: ORANGE_CORAIL },
                { label: 'Refusées', valeur: livraisons.refusees ?? 0, couleur: GRIS_DOUX },
              ].map(({ label, valeur, couleur }) => {
                const pourcentage = livraisons.total > 0 ? (valeur / livraisons.total) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gris-doux">{label}</span>
                      <span className="font-mono text-bleu-nuit">{valeur}</span>
                    </div>
                    <div className="h-1.5 bg-blanc-casse rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${pourcentage}%`, backgroundColor: couleur }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gris-doux py-16 text-center">Aucune livraison enregistrée.</p>
          )}
        </div>
      </div>
    </div>
  );
}
