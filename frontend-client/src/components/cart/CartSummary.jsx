import { formatCurrency } from '../../utils/format';
import Button from '../common/Button';
import { FiShoppingBag, FiCreditCard, FiArrowRight } from 'react-icons/fi';

const CartSummary = ({ 
  subtotal = 0, 
  taxes = 0, 
  shipping = 0, 
  onCheckout,
  checkoutDisabled = false,
  checkoutLoading = false,
  showShipping = true 
}) => {
  const total = subtotal + taxes + (showShipping ? shipping : 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-20 border-2 border-primary-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FiShoppingBag className="text-primary-600" />
        Résumé de la commande
      </h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        {showShipping && shipping > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Livraison</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <span>Taxes (TPS/TVH)</span>
          <span>{formatCurrency(taxes)}</span>
        </div>
        
        <div className="border-t-2 border-primary-200 pt-3">
          <div className="flex justify-between font-bold text-xl">
            <span>Total TTC</span>
            <span className="text-primary-600 text-2xl">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {onCheckout && (
        <div className="space-y-3">
          <Button
            onClick={onCheckout}
            disabled={checkoutDisabled || checkoutLoading}
            loading={checkoutLoading}
            className="w-full text-lg py-4 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            icon={<FiCreditCard className="text-xl" />}
            size="lg"
          >
            {checkoutLoading ? 'Traitement...' : (
              <>
                Passer la commande
                <FiArrowRight className="text-xl" />
              </>
            )}
          </Button>
          {!checkoutDisabled && (
            <p className="text-xs text-center text-gray-500 mt-2">
              ✓ Paiement sécurisé • ✓ Livraison rapide
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CartSummary;

