import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/orders';
import { addressesAPI } from '../api/addresses';
import { formatCurrency } from '../utils/format';
import { getImageUrl } from '../utils/imageUrl';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';
import { FiMapPin, FiCreditCard, FiShoppingBag } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Canada',
  });
  const [paymentMethod, setPaymentMethod] = useState('FAKE_PAYMENT');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242'); // Numéro fictif pré-rempli

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAddresses();
    }
  }, [isAuthenticated, user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressesAPI.getUserAddresses(user.id);
      const addressesList = Array.isArray(response) ? response : (response.data || []);
      setAddresses(addressesList);
      if (addressesList.length > 0) {
        setSelectedAddressId(addressesList[0].id.toString());
      } else {
        setUseNewAddress(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      navigate('/cart');
      return;
    }

    let shippingAddressId = selectedAddressId;

    // Si nouvelle adresse, créer d'abord l'adresse
    if (useNewAddress || !selectedAddressId) {
      try {
        setSubmitting(true);
        const addressResponse = await addressesAPI.create({
          user_id: user.id,
          ...newAddress,
          type: 'shipping',
        });
        shippingAddressId = addressResponse.data?.id || addressResponse.id;
      } catch (error) {
        toast.error('Erreur lors de la création de l\'adresse');
        return;
      }
    }

    // Créer la commande avec paiement fictif
    try {
      setSubmitting(true);
      
      // Préparer les items de la commande (filtrer les items sans produit valide)
      const validCartItems = cartItems.filter(item => item.product && item.product.id && item.product.price !== undefined);
      
      if (validCartItems.length === 0) {
        toast.error('Votre panier ne contient aucun produit valide');
        navigate('/cart');
        return;
      }

      const orderItems = validCartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity || 1,
        price: item.product.price || 0,
        customization: item.customization || null,
      }));

      // Calculer le total avec taxes
      const subtotal = getCartTotal();
      const taxes = subtotal * 0.15;
      const totalPrice = subtotal + taxes;

      // Créer la commande avec tous les items
      const orderResponse = await ordersAPI.create(
        user.id,
        shippingAddressId,
        shippingAddressId,
        orderItems,
        totalPrice,
        'carte_bancaire', // Méthode de paiement fictive
        'Paiement fictif - aucun prélèvement réel effectué'
      );

      if (orderResponse.success && orderResponse.data) {
        const orderId = orderResponse.data.id || orderResponse.data.data?.id;
        toast.success('Commande créée avec succès — paiement fictif effectué');
        await clearCart();
        navigate(`/order-confirmation?orderId=${orderId}`);
      } else {
        throw new Error(orderResponse.message || 'Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création de la commande';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = getCartTotal();
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  if (cartLoading || loading) return <Loading />;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <Button onClick={() => navigate('/products')}>
          Découvrir nos produits
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FiCreditCard className="text-primary-600" />
          Finaliser la commande
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Adresses */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiMapPin className="text-primary-600" />
                Adresse de livraison
              </h2>

              {addresses.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Utiliser une adresse existante
                  </label>
                  <select
                    value={useNewAddress ? '' : selectedAddressId}
                    onChange={(e) => {
                      setSelectedAddressId(e.target.value);
                      setUseNewAddress(false);
                    }}
                    className="input-field"
                    disabled={useNewAddress}
                  >
                    {addresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.street}, {addr.city}, {addr.province} {addr.postal_code}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useNewAddress}
                    onChange={(e) => setUseNewAddress(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Utiliser une nouvelle adresse</span>
                </label>
              </div>

              {useNewAddress && (
                <div className="space-y-4">
                  <Input
                    label="Rue"
                    name="street"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Ville"
                      name="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                    <Input
                      label="Province"
                      name="province"
                      value={newAddress.province}
                      onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Code postal"
                      name="postal_code"
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                      required
                    />
                    <Input
                      label="Pays"
                      name="country"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Résumé des articles */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiShoppingBag className="text-primary-600" />
                Articles
              </h2>
              <div className="space-y-4">
                {cartItems
                  .filter(item => item.product && item.product.id && item.product.price !== undefined)
                  .map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    <img
                      src={item.product?.image_url ? getImageUrl(item.product.image_url) : 'https://via.placeholder.com/80'}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product?.name}</h3>
                      <p className="text-sm text-gray-500">
                        Qté: {item.quantity} × {formatCurrency(item.product?.price || 0)}
                      </p>
                    </div>
                    <p className="font-bold">
                      {formatCurrency((item.product?.price || 0) * (item.quantity || 1))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Paiement Fictif */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-yellow-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCreditCard className="text-primary-600" />
                Paiement
              </h2>
              
              {/* Avertissement important */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">
                      ⚠️ Paiement simulé — aucun prélèvement réel
                    </p>
                    <p className="mt-1 text-sm text-yellow-700">
                      Ce système utilise un paiement fictif à des fins de démonstration. Aucune transaction réelle ne sera effectuée.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte (exemple fictif)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      // Formater avec des espaces tous les 4 chiffres
                      const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      setCardNumber(formatted.substring(0, 19)); // Limiter à 16 chiffres + 3 espaces
                    }}
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed"
                    placeholder="4242 4242 4242 4242"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ce champ est désactivé - numéro d'exemple uniquement
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      value="12/25"
                      disabled
                      className="input-field bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value="123"
                      disabled
                      className="input-field bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Méthode de paiement:</strong> Paiement fictif simulé
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Le statut de paiement sera automatiquement défini sur "PAID" (simulé)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de commande */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20 border border-gray-200">
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
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total TTC</span>
                    <span className="text-primary-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                disabled={submitting || (!useNewAddress && !selectedAddressId) || (useNewAddress && !newAddress.street)}
                loading={submitting}
                className="w-full"
                icon={<FiCreditCard />}
              >
                {submitting ? 'Traitement...' : 'Confirmer la commande'}
              </Button>
            </div>
          </div>
        </form>
    </div>
  );
};

export default Checkout;

