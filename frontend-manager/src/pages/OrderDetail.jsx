import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/orders';
import { formatCurrency, formatDate } from '../utils/format';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { ORDER_STATUS_OPTIONS } from '../utils/constants';
import { FiArrowLeft } from 'react-icons/fi';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(id);
      // Gérer différentes structures de réponse
      const orderData = response.data || response.order || response;
      setOrder(orderData);
      setStatus(orderData.status || '');
      setTrackingNumber(orderData.tracking_number || '');
      
      // Historique des statuts (si disponible)
      if (orderData.status_history) {
        setStatusHistory(orderData.status_history);
      } else {
        // Créer un historique basique si non disponible
        setStatusHistory([
          { status: orderData.status, date: orderData.created_at, note: 'Commande créée' }
        ]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Commande non trouvée';
      toast.error(errorMessage);
      console.error('Erreur fetchOrder:', error);
      if (error.response?.status === 404) {
        navigate('/orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await ordersAPI.updateStatus(id, status, trackingNumber);
      toast.success('Statut mis à jour avec succès');
      fetchOrder();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
      console.error('Erreur handleStatusUpdate:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading />;
  if (!order) return null;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <FiArrowLeft /> Retour aux commandes
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Commande #{order.id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informations client</h2>
          <div className="space-y-2">
            <p><strong>Nom:</strong> {order.user?.full_name || 'N/A'}</p>
            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
            {order.shipping_address && (
              <>
                <p className="mt-4"><strong>Adresse de livraison:</strong></p>
                <p className="text-sm text-gray-600">
                  {order.shipping_address.street}<br />
                  {order.shipping_address.city}, {order.shipping_address.postal_code}<br />
                  {order.shipping_address.country}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Statut de la commande</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut actuel
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
                disabled={updating}
              >
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Numéro de suivi"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              disabled={updating}
            />
            <div className="pt-2">
              <p className="text-sm text-gray-500 mb-2">
                <strong>Date de commande:</strong> {formatDate(order.created_at)}
              </p>
              {order.updated_at && order.updated_at !== order.created_at && (
                <p className="text-sm text-gray-500">
                  <strong>Dernière mise à jour:</strong> {formatDate(order.updated_at)}
                </p>
              )}
            </div>
            <Button onClick={handleStatusUpdate} disabled={updating || status === order.status}>
              {updating ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </div>
      </div>

      {/* Historique des statuts */}
      {statusHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Historique des statuts</h2>
          <div className="space-y-3">
            {statusHistory.map((historyItem, index) => (
              <div key={index} className="flex items-center gap-4 pb-3 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{historyItem.status || historyItem.note}</p>
                  {historyItem.note && historyItem.status && (
                    <p className="text-sm text-gray-500">{historyItem.note}</p>
                  )}
                  {historyItem.date && (
                    <p className="text-xs text-gray-400">{formatDate(historyItem.date)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Articles</h2>
        {order.order_items && order.order_items.length > 0 ? (
          <div className="space-y-4">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name || 'Produit #' + item.product_id}</p>
                  {item.product?.material && (
                    <p className="text-sm text-gray-500">Matériau: {item.product.material}</p>
                  )}
                  {item.customization && (
                    <p className="text-sm text-gray-500">Personnalisation: {JSON.stringify(item.customization)}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Quantité: {item.quantity} × {formatCurrency(item.unit_price || item.price || 0)}
                  </p>
                </div>
                <p className="font-bold text-lg">{formatCurrency(item.subtotal || (item.quantity * (item.unit_price || item.price || 0)))}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
              <p className="text-xl font-bold">Total</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(order.total_price || 0)}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Aucun article dans cette commande</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;

