import { useEffect, useState, useRef } from 'react';
import { dashboardAPI } from '../api/dashboard';
import StatsCard from '../components/dashboard/StatsCard';
import Loading from '../components/common/Loading';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiRefreshCw } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef(null);

  // Fonction pour récupérer les statistiques
  const fetchStats = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsRefreshing(true);
      }
      const response = await dashboardAPI.getStats();
      setStats(response.data || response);
      setLastUpdate(new Date());
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des statistiques';
      console.error('Erreur fetchStats:', error);
      // Ne pas afficher de toast pour le dashboard, juste logger
      setStats({
        total_revenue: 0,
        total_orders: 0,
        total_customers: 0,
        total_products: 0,
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchStats(true);
  }, []);

  // Mise à jour automatique toutes les 30 secondes
  useEffect(() => {
    // Créer l'intervalle pour la mise à jour automatique
    intervalRef.current = setInterval(() => {
      fetchStats(false); // Mise à jour silencieuse en arrière-plan
    }, 30000); // 30 secondes

    // Nettoyer l'intervalle au démontage
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Fonction pour rafraîchir manuellement
  const handleManualRefresh = () => {
    fetchStats(true);
  };

  // Formater l'heure de dernière mise à jour
  const formatLastUpdate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 10) return 'À l\'instant';
    if (diff < 60) return `Il y a ${diff} secondes`;
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minutes`;
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      {/* En-tête avec indicateur de mise à jour en temps réel */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Mise à jour automatique</span>
            <span className="text-gray-400">•</span>
            <span>{formatLastUpdate(lastUpdate)}</span>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Rafraîchir les données"
          >
            <FiRefreshCw className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Rafraîchir</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Chiffre d'affaires"
          value={stats?.total_revenue || 0}
          icon={FiDollarSign}
          color="green"
          format="currency"
        />
        <StatsCard
          title="Commandes"
          value={stats?.total_orders || 0}
          icon={FiShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Clients"
          value={stats?.total_customers || 0}
          icon={FiUsers}
          color="purple"
        />
        <StatsCard
          title="Produits"
          value={stats?.total_products || 0}
          icon={FiPackage}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenue dans le tableau de bord</h2>
        <p className="text-gray-600 mb-2">
          Utilisez le menu de navigation pour gérer les produits, commandes, catégories et utilisateurs.
        </p>
        <p className="text-sm text-gray-500">
          Les statistiques sont mises à jour automatiquement toutes les 30 secondes.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

