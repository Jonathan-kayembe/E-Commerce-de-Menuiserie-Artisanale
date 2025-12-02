import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/orders';
import Loading from '../components/common/Loading';
import { formatCurrency, formatDate, formatDateTime } from '../utils/format';
import { getImageUrl } from '../utils/imageUrl';
import { FiPackage, FiCalendar, FiDollarSign, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  // Faire disparaître le message d'erreur après 3 secondes
  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      const timer = setTimeout(() => {
        setErrorVisible(false);
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setErrorVisible(false);
    }
  }, [error]);

  const fetchOrders = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await ordersAPI.getMyOrders(user.id);
      
      // Gérer différentes structures de réponse
      const ordersList = Array.isArray(response) 
        ? response 
        : (response.data || response.orders || []);
      
      // S'assurer que chaque commande a ses items chargés
      const ordersWithItems = await Promise.all(
        ordersList.map(async (order) => {
          // Si la commande n'a pas déjà ses items, les récupérer
          if (!order.order_items && order.id) {
            try {
              const orderDetail = await ordersAPI.getById(order.id);
              return orderDetail.data || orderDetail || order;
            } catch (err) {
              return order;
            }
          }
          return order;
        })
      );
      
      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('livrée') || statusLower.includes('livre')) {
      return 'bg-success-50 text-success-700 border-success-200';
    }
    if (statusLower.includes('expédiée') || statusLower.includes('expedie')) {
      return 'bg-primary-50 text-primary-700 border-primary-200';
    }
    if (statusLower.includes('payée') || statusLower.includes('paye')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (statusLower.includes('annulée') || statusLower.includes('annule')) {
      return 'bg-error-50 text-error-700 border-error-200';
    }
    return 'bg-warning-50 text-warning-700 border-warning-200';
  };

  const getStatusLabel = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('livrée')) return 'Livrée';
    if (statusLower.includes('expédiée')) return 'Expédiée';
    if (statusLower.includes('payée')) return 'Payée';
    if (statusLower.includes('annulée')) return 'Annulée';
    if (statusLower.includes('préparation')) return 'En préparation';
    return status || 'Inconnu';
  };

  if (authLoading || loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FiPackage className="text-primary-600" />
          Mes Commandes
        </h1>
      </div>

      {error && errorVisible && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucune commande</h2>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande.</p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center gap-2"
          >
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // Calculer le total depuis order_items ou utiliser total_price
            const orderTotal = order.order_items?.reduce((total, item) => {
              const price = item.unit_price || item.product?.price || item.price || 0;
              const quantity = item.quantity || 0;
              return total + (price * quantity);
            }, 0) || order.total_price || order.total || 0;

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">Commande #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiCalendar />
                          <span>{formatDate(order.created_at || order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiPackage />
                          <span>{(order.order_items || order.items)?.length || 0} article{((order.order_items || order.items)?.length || 0) > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiDollarSign />
                          <span className="font-semibold text-gray-900">{formatCurrency(orderTotal)}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Voir les détails
                      <FiChevronRight />
                    </Link>
                  </div>

                  {/* Order Items Preview */}
                  {(order.order_items || order.items) && (order.order_items || order.items).length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(order.order_items || order.items).slice(0, 3).map((item, index) => (
                          <div key={item.id || index} className="flex items-center gap-3">
                            <img
                              src={(item.product?.image_url || item.image_url) ? getImageUrl(item.product?.image_url || item.image_url) : 'https://via.placeholder.com/60'}
                              alt={item.product?.name || item.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/60';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {item.product?.name || item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qté: {item.quantity} × {formatCurrency(item.unit_price || item.product?.price || item.price || 0)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {(order.order_items || order.items).length > 3 && (
                          <div className="flex items-center justify-center text-sm text-gray-500">
                            +{(order.order_items || order.items).length - 3} autre{(order.order_items || order.items).length - 3 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;

