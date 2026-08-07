import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar,
} from 'recharts';
import { Link } from 'react-router-dom';
import { Clock, Package, CreditCard, Pill, AlertTriangle, ArrowRight } from 'lucide-react';
import Skeleton from '../atoms/Skeleton';
import StatCard from '../molecules/StatCard';

const VERT_MEDICAL = '#12A05C';
const BLEU_NUIT = '#1A3A5C';
const GRIS_DOUX = '#6B7280';

function formatJour(date) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: '2-digit' }).format(new Date(date));
}

function formatPeriode(periode) {
  const [annee, mois] = periode.split('-');
  return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' }).format(new Date(annee, mois - 1));
}

function montantEnNombre(montantFormate) {
  return Number(String(montantFormate ?? '0').replace(/[^0-9.-]/g, '')) || 0;
}

/**
 * @param {{ stats: object, isLoading: boolean }} props
 */
export default function PharmacienDashboardStats({ stats = {}, isLoading }) {
  const commandes = stats.commandes || {};
  const stock = stats.stock || {};
  const revenus = stats.revenus || {};

  const evolutionCommandes = (commandes.par_jour || []).map((point) => ({
    jour: formatJour(point.jour),
    total: point.total,
  }));

  const evolutionRevenus = (revenus.par_mois || []).map((point) => ({
    periode: formatPeriode(point.periode),
    total: montantEnNombre(point.total),
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" height="100px" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} variant="card" height="280px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Commandes en attente"
          valeur={commandes.en_attente ?? 0}
          sousTexte={`${commandes.en_cours ?? 0} en cours de traitement`}
          variant="bleu"
        />
        <StatCard
          icon={Package}
          label="Commandes complétées"
          valeur={commandes.completees ?? 0}
          sousTexte={`${commandes.taux_completion ?? '0%'} du total`}
          variant="bleu"
        />
        <StatCard
          icon={CreditCard}
          label="Revenus (ce mois)"
          valeur={revenus.ce_mois ?? '0 FCFA'}
          sousTexte={`Total général : ${revenus.total_general ?? '0 FCFA'}`}
          variant="vert"
        />
        <StatCard
          icon={Pill}
          label="Produits au catalogue"
          valeur={stock.total_produits ?? 0}
          sousTexte={`${stock.stock_critique ?? 0} en rupture critique`}
          variant="vert"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-5">
          <h3 className="font-medium text-bleu-nuit mb-4">Évolution des commandes (7 derniers jours)</h3>
          {evolutionCommandes.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={evolutionCommandes}>
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
          <h3 className="font-medium text-bleu-nuit mb-4">Revenus (6 derniers mois)</h3>
          {evolutionRevenus.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={evolutionRevenus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" />
                <XAxis dataKey="periode" tick={{ fontSize: 12 }} stroke={GRIS_DOUX} />
                <YAxis tick={{ fontSize: 12 }} stroke={GRIS_DOUX} />
                <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`} />
                <Bar dataKey="total" name="Revenus" fill={BLEU_NUIT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gris-doux py-16 text-center">Aucun revenu sur les 6 derniers mois.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-bleu-nuit">État du stock</h3>
          <Link to="/pharmacien/catalogue" className="flex items-center gap-1 text-xs text-vert-medical hover:text-vert-profond transition-colors duration-200">
            Voir le catalogue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div>
            <p className="text-xs text-gris-doux uppercase tracking-wide mb-1">Total produits</p>
            <p className="font-mono text-lg font-medium text-bleu-nuit">{stock.total_produits ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-gris-doux uppercase tracking-wide mb-1">Stock faible</p>
            <p className="font-mono text-lg font-medium text-orange-corail">{stock.stock_faible ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-gris-doux uppercase tracking-wide mb-1">Rupture critique</p>
            <p className="font-mono text-lg font-medium text-danger flex items-center gap-1.5">
              {(stock.stock_critique ?? 0) > 0 && <AlertTriangle className="w-4 h-4" />}
              {stock.stock_critique ?? 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gris-doux uppercase tracking-wide mb-1">Indisponibles</p>
            <p className="font-mono text-lg font-medium text-gris-doux">{stock.indisponibles ?? 0}</p>
          </div>
        </div>

        {/* Seules les ruptures critiques (action immédiate requise) sont listées nommément ;
            le stock faible reste résumé dans son compteur ci-dessus pour rester lisible
            quel que soit le nombre de produits au catalogue. */}
        {stock.alertes?.length ? (
          <div className="border-t border-gris-bordure pt-4 space-y-1">
            <p className="text-xs text-gris-doux uppercase tracking-wide mb-2">À traiter en priorité</p>
            {stock.alertes.map((alerte) => (
              <div key={alerte.idStock} className="flex items-center justify-between gap-3 px-3 py-2 rounded-[6px] border-l-[3px] border-danger bg-[#FEE2E2]/40">
                <span className="flex items-center gap-2 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
                  <span className="text-sm text-bleu-nuit truncate">{alerte.medicament}</span>
                </span>
                <span className="text-xs font-mono font-medium shrink-0 text-danger">
                  {alerte.stock_actuel} unité{alerte.stock_actuel > 1 ? 's' : ''}
                </span>
              </div>
            ))}
            {stock.total_alertes > stock.alertes.length && (
              <Link
                to="/pharmacien/catalogue"
                className="block text-xs text-vert-medical hover:text-vert-profond text-center pt-2 transition-colors duration-200"
              >
                +{stock.total_alertes - stock.alertes.length} autre(s) rupture(s) critique(s) — voir le catalogue
              </Link>
            )}
          </div>
        ) : (
          <p className="text-sm text-gris-doux text-center py-4 border-t border-gris-bordure">Aucune rupture critique pour le moment.</p>
        )}
      </div>
    </div>
  );
}
