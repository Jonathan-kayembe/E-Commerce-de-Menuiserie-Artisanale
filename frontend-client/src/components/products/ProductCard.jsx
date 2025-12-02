import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';
import { getImageUrl } from '../../utils/imageUrl';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleViewClick = (e) => {
    e.preventDefault();
    navigate(`/products/${product.id}`);
  };

  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour continuer');
      navigate(`/login?from=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (isOutOfStock) {
      toast.error('Ce produit est en rupture de stock');
      return;
    }

    const result = await addToCart(product.id, 1, null);
    if (result.success) {
      toast.success('Produit ajouté au panier');
    }
  };

  return (
    <div className="product-card group">
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100">
          <div className="aspect-square w-full">
            <img
              src={product.image_url ? getImageUrl(product.image_url) : 'https://via.placeholder.com/400x400/f5f0e8/8B6F47?text=Produit'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/f5f0e8/8B6F47?text=Produit';
              }}
            />
          </div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3 badge-error animate-pulse-slow">
              Rupture de stock
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-3 right-3 badge-warning">
              Stock limité
            </div>
          )}

          {/* Quick Actions - Visible on Hover */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={handleViewClick}
              className="flex-1 bg-white/90 backdrop-blur-sm text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <FiEye size={18} />
              <span className="text-sm">Voir</span>
            </button>
            {!isOutOfStock && (
              <button
                onClick={handleAddToCartClick}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <FiShoppingCart size={18} />
                <span className="text-sm">Panier</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category Badge */}
          {product.category && (
            <span className="inline-block badge-primary mb-2 text-xs">
              {product.category.name || product.category}
            </span>
          )}

          {/* Product Name */}
          <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Material & Color Info */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.material && (
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {product.material}
              </span>
            )}
            {product.color && (
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {product.color}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(product.price)}
              </p>
              {product.stock > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {product.stock} en stock
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

