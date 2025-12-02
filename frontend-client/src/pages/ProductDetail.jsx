import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';
import { reviewsAPI } from '../api/reviews';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import ProductGallery from '../components/products/ProductGallery';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({
    dimensions: { length: '', width: '', height: '' },
    material: '',
    color: '',
  });

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      const productData = response.data || response;
      setProduct(productData);
    } catch (error) {
      toast.error('Produit non trouvé');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getProductReviews(id);
      const reviewsList = Array.isArray(response) ? response : (response.data || []);
      setReviews(reviewsList);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour continuer');
      navigate(`/login?from=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const custom = Object.keys(customization.dimensions).some(
      (key) => customization.dimensions[key]
    ) || customization.material || customization.color
      ? customization
      : null;

    const result = await addToCart(product.id, quantity, custom);
    if (result.success) {
      setQuantity(1);
      setCustomization({
        dimensions: { length: '', width: '', height: '' },
        material: '',
        color: '',
      });
    }
  };

  if (loading) return <Loading />;
  if (!product) return null;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
        {/* Galerie d'images */}
        <div className="sticky top-20">
          <ProductGallery
            images={product.image_url ? [product.image_url] : []}
            productName={product.name}
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary-600 mb-4">
            {formatCurrency(product.price)}
          </p>
          
          {averageRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-lg">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({reviews.length} avis)</span>
            </div>
          )}

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Details */}
          <div className="mb-6 space-y-2">
            {product.material && (
              <p><strong>Matériau:</strong> {product.material}</p>
            )}
            {product.color && (
              <p><strong>Couleur:</strong> {product.color}</p>
            )}
            {product.finish && (
              <p><strong>Finition:</strong> {product.finish}</p>
            )}
            <p>
              <strong>Stock:</strong>{' '}
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} disponible(s)` : 'Rupture de stock'}
              </span>
            </p>
          </div>

          {/* Customization */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Personnalisation (optionnel)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Longueur"
                    value={customization.dimensions.length}
                    onChange={(e) => setCustomization({
                      ...customization,
                      dimensions: { ...customization.dimensions, length: e.target.value }
                    })}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Largeur"
                    value={customization.dimensions.width}
                    onChange={(e) => setCustomization({
                      ...customization,
                      dimensions: { ...customization.dimensions, width: e.target.value }
                    })}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Hauteur"
                    value={customization.dimensions.height}
                    onChange={(e) => setCustomization({
                      ...customization,
                      dimensions: { ...customization.dimensions, height: e.target.value }
                    })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1"
            >
              {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Avis clients ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Aucun avis pour ce produit</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold">{review.rating}/5</span>
                  <span className="text-gray-500 text-sm">
                    {review.user?.full_name || 'Utilisateur'}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

