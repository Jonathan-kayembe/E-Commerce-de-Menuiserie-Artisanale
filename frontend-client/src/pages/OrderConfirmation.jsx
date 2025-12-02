import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ordersAPI } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import { formatCurrency, formatDate } from '../utils/format';
import { getImageUrl } from '../utils/imageUrl';
import { FiCheckCircle, FiPackage, FiCalendar, FiDollarSign, FiHome, FiShoppingBag } from 'react-icons/fi';
import Button from '../components/common/Button';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!orderId) {
      navigate('/orders');
      return;
    }

    fetchOrder();
  }, [orderId, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(orderId);
      const orderData = response.data || response;
      
      // Vérifier que la commande appartient à l'utilisateur
      if (orderData.user_id !== user?.id) {
        navigate('/orders');
        return;
      }
      
      setOrder(orderData);
    } catch (error) {
      console.error('Erreur:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!order) return null;

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('payée') || statusLower.includes('paye')) {
      return 'bg-success-50 text-success-700 border-success-200';
    }
    if (statusLower.includes('livrée') || statusLower.includes('livre')) {
      return 'bg-primary-50 text-primary-700 border-primary-200';
    }
    return 'bg-warning-50 text-warning-700 border-warning-200';
  };

  const getStatusLabel = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('payée')) return 'Payée';
    if (statusLower.includes('livrée')) return 'Livrée';
    if (statusLower.includes('expédiée')) return 'Expédiée';
    return status || 'En préparation';
  };

  const orderTotal = order.order_items?.reduce((total, item) => {
    const price = item.unit_price || item.product?.price || item.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0) || order.total_price || order.total || 0;

  const taxes = orderTotal * 0.15;
  const subtotal = orderTotal - taxes;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Message de confirmation */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center">
            <FiCheckCircle className="text-success-600 text-5xl" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Merci pour votre commande !</h1>
        <p className="text-xl text-gray-600 mb-4">
          Votre commande #{order.id} a été confirmée
        </p>
        <div className="inline-block px-4 py-2 rounded-full border-2 font-semibold mb-6">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      {/* Résumé de la commande */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FiPackage className="text-primary-600" />
          Résumé de la commande
        </h2>

        {/* Informations de la commande */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Date de commande</p>
              <p className="font-semibold">{formatDate(order.created_at || order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiDollarSign className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Montant total</p>
              <p className="font-semibold text-primary-600 text-xl">{formatCurrency(orderTotal + taxes)}</p>
            </div>
          </div>
        </div>

        {/* Articles commandés */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Articles commandés</h3>
          <div className="space-y-4">
            {(order.order_items || order.items || []).map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                <img
                  src={(item.product?.image_url || item.image_url) ? getImageUrl(item.product?.image_url || item.image_url) : 'https://via.placeholder.com/80'}
                  alt={item.product?.name || item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.product?.name || item.name}</h4>
                  <p className="text-sm text-gray-500">
                    Qté: {item.quantity} × {formatCurrency(item.unit_price || item.product?.price || item.price || 0)}
                  </p>
                  {item.customization && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.customization.dimensions && (
                        <p>Dimensions: {Object.values(item.customization.dimensions).filter(v => v).join(' × ')} cm</p>
                      )}
                      {item.customization.material && <p>Matériau: {item.customization.material}</p>}
                      {item.customization.color && <p>Couleur: {item.customization.color}</p>}
                    </div>
                  )}
                </div>
                <p className="font-bold text-lg">
                  {formatCurrency((item.unit_price || item.product?.price || item.price || 0) * (item.quantity || 1))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Détails financiers */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Sous-total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxes (TPS/TVH)</span>
            <span>{formatCurrency(taxes)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between font-bold text-xl">
              <span>Total TTC</span>
              <span className="text-primary-600">{formatCurrency(orderTotal + taxes)}</span>
            </div>
          </div>
        </div>

        {/* Informations de paiement */}
        {order.payment && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Informations de paiement</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Méthode:</strong> {order.payment.method === 'carte_bancaire' ? 'Carte bancaire' : order.payment.method}
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                <strong>Statut:</strong> {order.payment.status === 'réussi' ? 'Paiement réussi (simulé)' : order.payment.status}
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                ⚠️ Ce paiement est fictif et à des fins de démonstration uniquement.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => navigate(`/orders/${order.id}`)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FiPackage />
          Voir les détails de la commande
        </Button>
        <Link to="/products">
          <Button variant="secondary" className="flex items-center gap-2 w-full sm:w-auto">
            <FiShoppingBag />
            Continuer vos achats
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 w-full sm:w-auto">
            <FiHome />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

