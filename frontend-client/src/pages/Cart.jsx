import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loading from '../components/common/Loading';
import CartSummary from '../components/cart/CartSummary';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import { getImageUrl } from '../utils/imageUrl';
import Button from '../components/common/Button';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, removeItem, updateItem, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [updatingItems, setUpdatingItems] = useState({});

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg mb-4">Veuillez vous connecter pour voir votre panier</p>
        <Link to="/login" className="text-primary-600 hover:underline">
          Se connecter
        </Link>
      </div>
    );
  }

  if (loading) return <Loading />;

  // Filtrer les items valides (avec produit valide)
  const validCartItems = cartItems.filter(item => item.product && item.product.id && item.product.price !== undefined);

  if (!validCartItems || validCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <Link
          to="/products"
          className="text-primary-600 hover:underline font-semibold"
        >
          Continuer vos achats →
        </Link>
      </div>
    );
  }

  const total = getCartTotal();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItems({ ...updatingItems, [itemId]: true });
    try {
      await updateItem(itemId, newQuantity);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdatingItems({ ...updatingItems, [itemId]: false });
    }
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer cet article du panier ?')) {
      try {
        await removeItem(itemId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (validCartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FiShoppingBag className="text-primary-600" />
          Mon panier
        </h1>
        {/* Bouton "Passer commande" visible en haut sur mobile */}
        <div className="sm:hidden">
          <Button
            onClick={handleCheckout}
            disabled={validCartItems.length === 0}
            className="w-full text-lg py-3 font-bold shadow-lg"
            icon={<FiCreditCard />}
            size="lg"
          >
            Passer la commande
            <FiArrowRight />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {validCartItems.map((item) => {
              const itemPrice = item.product?.price || 0;
              const itemQuantity = item.quantity || 1;
              const itemTotal = itemPrice * itemQuantity;
              const isUpdating = updatingItems[item.id];

              return (
                <div key={item.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={`/products/${item.product?.id || item.product_id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product?.image_url ? getImageUrl(item.product.image_url) : 'https://via.placeholder.com/150'}
                        alt={item.product?.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product?.id || item.product_id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary-600 transition-colors">
                          {item.product?.name}
                        </h3>
                      </Link>
                      <p className="text-primary-600 font-bold text-lg mt-1">
                        {formatCurrency(itemPrice)}
                      </p>
                      {item.customization && (
                        <div className="text-sm text-gray-500 mt-2">
                          <p className="font-medium">Personnalisation:</p>
                          {item.customization.dimensions && (
                            <p>Dimensions: {Object.values(item.customization.dimensions).filter(v => v).join(' × ')} cm</p>
                          )}
                          {item.customization.material && <p>Matériau: {item.customization.material}</p>}
                          {item.customization.color && <p>Couleur: {item.customization.color}</p>}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, itemQuantity - 1)}
                            disabled={isUpdating || itemQuantity <= 1}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <FiMinus size={18} />
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">
                            {itemQuantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, itemQuantity + 1)}
                            disabled={isUpdating}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <FiPlus size={18} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="flex items-center gap-2 text-error-600 hover:text-error-700 font-medium transition-colors"
                          aria-label="Supprimer l'article"
                        >
                          <FiTrash2 size={18} />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-right sm:text-left sm:min-w-[100px]">
                      <p className="text-sm text-gray-500 mb-1">Sous-total</p>
                      <p className="font-bold text-lg">
                        {formatCurrency(itemTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <CartSummary
            subtotal={total}
            taxes={total * 0.15}
            shipping={0}
            onCheckout={handleCheckout}
            checkoutDisabled={validCartItems.length === 0}
            showShipping={false}
          />
          <button
            onClick={async () => {
              if (window.confirm('Êtes-vous sûr de vouloir vider complètement votre panier ?')) {
                try {
                  await clearCart();
                } catch (error) {
                  console.error('Erreur lors du vidage du panier:', error);
                }
              }
            }}
            className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={validCartItems.length === 0}
          >
            Vider le panier
          </button>
          <Link
            to="/products"
            className="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Continuer vos achats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

