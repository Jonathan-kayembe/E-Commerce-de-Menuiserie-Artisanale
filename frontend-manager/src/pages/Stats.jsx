import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/dashboard';
import { ordersAPI } from '../api/orders';
import { productsAPI } from '../api/products';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../utils/format';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Récupérer les stats générales
      const statsResponse = await dashboardAPI.getStats();
      setStats(statsResponse.data);

      // Récupérer les commandes pour les graphiques
      const ordersResponse = await ordersAPI.getAll();
      let orders = [];
      if (Array.isArray(ordersResponse)) {
        orders = ordersResponse;
      } else if (ordersResponse?.data) {
        orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
      } else if (ordersResponse?.orders) {
        orders = Array.isArray(ordersResponse.orders) ? ordersResponse.orders : [];
      }

      // Récupérer les produits
      const productsResponse = await productsAPI.getAll();
      let products = [];
      if (Array.isArray(productsResponse)) {
        products = productsResponse;
      } else if (productsResponse?.data) {
        products = Array.isArray(productsResponse.data) ? productsResponse.data : [];
      }

      // Préparer les données de ventes par mois
      const monthlyData = {};
      orders.forEach(order => {
        if (order.created_at) {
          const date = new Date(order.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthLabel = date.toLocaleDateString('fr-CA', { year: 'numeric', month: 'short' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              month: monthLabel,
              ventes: 0,
              commandes: 0,
            };
          }
          monthlyData[monthKey].ventes += parseFloat(order.total_price) || 0;
          monthlyData[monthKey].commandes += 1;
        }
      });

      const monthlyArray = Object.values(monthlyData).sort((a, b) => {
        return new Date(a.month) - new Date(b.month);
      });
      setMonthlySales(monthlyArray);

      // Top produits (basé sur les commandes)
      const productSales = {};
      orders.forEach(order => {
        if (order.order_items) {
          order.order_items.forEach(item => {
            const productId = item.product_id || item.product?.id;
            const productName = item.product?.name || `Produit ${productId}`;
            if (!productSales[productId]) {
              productSales[productId] = {
                name: productName,
                ventes: 0,
                quantite: 0,
              };
            }
            productSales[productId].ventes += parseFloat(item.subtotal) || 0;
            productSales[productId].quantite += parseInt(item.quantity) || 0;
          });
        }
      });

      const topProductsArray = Object.values(productSales)
        .sort((a, b) => b.ventes - a.ventes)
        .slice(0, 5);
      setTopProducts(topProductsArray);

      // Données de ventes par statut
      const statusData = {};
      orders.forEach(order => {
        const status = order.status || 'inconnu';
        if (!statusData[status]) {
          statusData[status] = { name: status, value: 0 };
        }
        statusData[status].value += parseFloat(order.total_price) || 0;
      });
      setSalesData(Object.values(statusData));

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des statistiques';
      toast.error(errorMessage);
      console.error('Erreur fetchStats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Statistiques</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Chiffre d'affaires total</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(stats?.total_revenue || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total commandes</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.total_orders || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total clients</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.total_customers || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total produits</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.total_products || 0}
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ventes par mois */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ventes par mois</h2>
          {monthlySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ventes" 
                  stroke="#0088FE" 
                  name="Ventes (CAD)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="commandes" 
                  stroke="#00C49F" 
                  name="Nombre de commandes"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
          )}
        </div>

        {/* Top produits */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top 5 produits</h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="ventes" fill="#8884d8" name="Ventes (CAD)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
          )}
        </div>
      </div>

      {/* Ventes par statut */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Ventes par statut de commande</h2>
        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {salesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
        )}
      </div>
    </div>
  );
};

export default Stats;

