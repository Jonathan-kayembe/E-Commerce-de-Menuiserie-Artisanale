import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/orders';
import Loading from '../components/common/Loading';
import { formatCurrency, formatDate, formatDateTime } from '../utils/format';
import { getImageUrl } from '../utils/imageUrl';
import { FiPackage, FiCalendar, FiDollarSign, FiMapPin, FiCreditCard, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/common/Button';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user?.id) {
      fetchOrder();
    }
  }, [id, user, authLoading]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ordersAPI.getById(id);
      const orderData = response.data || response;
      
      // Vérifier que la commande appartient à l'utilisateur (sauf si manager)
      if (orderData.user_id !== user?.id && user?.role !== 'manager') {
        setError('Vous n\'avez pas accès à cette commande');
        return;
      }
      
      setOrder(orderData);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement de la commande');
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Button onClick={() => navigate('/orders')}>
          Retour aux commandes
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Commande non trouvée</h2>
        <Button onClick={() => navigate('/orders')}>
          Retour aux commandes
        </Button>
      </div>
    );
  }

  const orderTotal = order.order_items?.reduce((total, item) => {
    const price = item.unit_price || item.product?.price || item.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0) || order.total_price || order.total || 0;

  const taxes = orderTotal * 0.15;
  const subtotal = orderTotal - taxes;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* En-tête */}
      <div className="mb-6">
        <Button
          onClick={() => navigate('/orders')}
          variant="ghost"
          className="mb-4 flex items-center gap-2"
        >
          <FiArrowLeft />
          Retour aux commandes
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FiPackage className="text-primary-600" />
              Commande #{order.id}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiCalendar />
                <span>{formatDate(order.created_at || order.createdAt)}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles de la commande */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Articles commandés</h2>
            <div className="space-y-4">
              {(order.order_items || order.items || []).map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <img
                    src={(item.product?.image_url || item.image_url) ? getImageUrl(item.product?.image_url || item.image_url) : 'https://via.placeholder.com/100'}
                    alt={item.product?.name || item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product?.name || item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Qté: {item.quantity} × {formatCurrency(item.unit_price || item.product?.price || item.price || 0)}
                    </p>
                    {item.customization && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {item.customization.dimensions && (
                          <p>Dimensions: {Object.values(item.customization.dimensions).filter(v => v).join(' × ')} cm</p>
                        )}
                        {item.customization.material && <p>Matériau: {item.customization.material}</p>}
                        {item.customization.color && <p>Couleur: {item.customization.color}</p>}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {formatCurrency((item.unit_price || item.product?.price || item.price || 0) * (item.quantity || 1))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adresse de livraison */}
          {order.shipping_address && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiMapPin className="text-primary-600" />
                Adresse de livraison
              </h2>
              <div className="text-gray-700">
                <p className="font-medium">{order.shipping_address.street}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.province}</p>
                <p>{order.shipping_address.postal_code}</p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          )}

          {/* Informations de paiement */}
          {order.payment && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCreditCard className="text-primary-600" />
                Informations de paiement
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode:</span>
                  <span className="font-medium">
                    {order.payment.method === 'carte_bancaire' ? 'Carte bancaire' : order.payment.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className="font-medium text-success-600">
                    {order.payment.status === 'réussi' ? 'Paiement réussi (simulé)' : order.payment.status}
                  </span>
                </div>
                {order.payment.transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">{order.payment.transaction_id}</span>
                  </div>
                )}
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Ce paiement est fictif et à des fins de démonstration uniquement.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonne latérale - Résumé */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Résumé</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes (TPS/TVH)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              {order.tracking_number && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Numéro de suivi:</span>
                    <span className="font-mono font-semibold">{order.tracking_number}</span>
                  </div>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-bold text-xl">
                  <span>Total TTC</span>
                  <span className="text-primary-600">{formatCurrency(orderTotal + taxes)}</span>
                </div>
              </div>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

