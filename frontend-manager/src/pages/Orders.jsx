import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../api/orders';
import { formatCurrency, formatDate } from '../utils/format';
import Loading from '../components/common/Loading';
import SearchBar from '../components/common/SearchBar';
import { toast } from 'react-toastify';
import { ORDER_STATUS_OPTIONS } from '../utils/constants';
import { FiEye } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      // Gérer différentes structures de réponse
      let ordersList = [];
      if (Array.isArray(response)) {
        ordersList = response;
      } else if (response?.data) {
        ordersList = Array.isArray(response.data) ? response.data : [];
      } else if (response?.orders) {
        ordersList = Array.isArray(response.orders) ? response.orders : [];
      }
      
      let filtered = ordersList;
      if (statusFilter) {
        filtered = filtered.filter(o => o.status === statusFilter);
      }
      if (search) {
        filtered = filtered.filter(o => 
          String(o.id).includes(search) ||
          (o.user?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
          (o.user?.email || '').toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setOrders(filtered);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des commandes';
      toast.error(errorMessage);
      console.error('Erreur fetchOrders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, trackingNumber) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus, trackingNumber);
      toast.success('Statut mis à jour avec succès');
      fetchOrders();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
      console.error('Erreur handleStatusUpdate:', error);
    }
  };

  if (loading && !orders.length) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Commandes</h1>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher par ID, nom client ou email..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-64"
        >
          <option value="">Tous les statuts</option>
          {ORDER_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.full_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value, order.tracking_number)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {formatCurrency(order.total_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEye className="text-xl" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;

