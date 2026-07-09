import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import { Users, Store, Package, CreditCard } from 'lucide-react';
import Card from '../atoms/Card';
import Skeleton from '../atoms/Skeleton';
import StatCard from '../molecules/StatCard';
import { COULEURS, STATUTS_COMMANDE } from '../../utils/constants';

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
    { label: STATUTS_COMMANDE.acceptee.label, total: enCours, couleur: STATUTS_COMMANDE.acceptee.couleur },
    { label: STATUTS_COMMANDE.livree.label, total: completees, couleur: STATUTS_COMMANDE.livree.couleur },
    { label: STATUTS_COMMANDE.refusee.label, total: annulees, couleur: STATUTS_COMMANDE.refusee.couleur },
    { label: 'Autres', total: autres, couleur: COULEURS.gris },
  ].filter((s) => s.total > 0);

  const topPharmacies = (pharmacies.top_5 || []).map((p) => ({
    nom: p.nomPharmacie,
    total: p.total_commandes,
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" valeur={patients.total ?? 0} sousTexte={`+${patients.nouveaux_ce_mois ?? 0} ce mois`} couleur={COULEURS.bleu} />
        <StatCard icon={Store} label="Total Pharmacies" valeur={pharmacies.total ?? 0} sousTexte={`${pharmacies.actives ?? 0} actives`} couleur={COULEURS.vert} />
        <StatCard icon={Package} label="Commandes" valeur={commandes.total ?? 0} sousTexte={`${enCours} en cours • ${commandes.taux_completion ?? '0%'} complétées`} couleur={COULEURS.warning} />
        <StatCard icon={CreditCard} label="Revenus (ce mois)" valeur={revenus.ce_mois ?? '0 FCFA'} sousTexte={`Total général : ${revenus.total_general ?? '0 FCFA'}`} couleur={COULEURS.succes} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-noir mb-4">Évolution des commandes (7 derniers jours)</h3>
          {evolution.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={evolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" />
                <XAxis dataKey="jour" tick={{ fontSize: 12 }} stroke={COULEURS.gris} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke={COULEURS.gris} />
                <Tooltip />
                <Line type="monotone" dataKey="total" name="Commandes" stroke={COULEURS.vert} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gris py-16 text-center">Aucune commande sur les 7 derniers jours.</p>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-noir mb-4">Répartition des commandes</h3>
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
            <p className="text-sm text-gris py-16 text-center">Aucune donnée disponible.</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-noir mb-4">Top 5 pharmacies par commandes</h3>
        {topPharmacies.length ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topPharmacies} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} stroke={COULEURS.gris} />
              <YAxis type="category" dataKey="nom" tick={{ fontSize: 12 }} stroke={COULEURS.gris} width={140} />
              <Tooltip />
              <Bar dataKey="total" name="Commandes" fill={COULEURS.bleu} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gris py-16 text-center">Aucune donnée disponible.</p>
        )}
      </Card>
    </div>
  );
}
