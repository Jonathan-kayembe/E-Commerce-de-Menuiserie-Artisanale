import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../api/products';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';
import { FiArrowRight, FiAward, FiTruck, FiShield } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const products = Array.isArray(response) ? response : (response.data || []);
      setFeaturedProducts(products.slice(0, 8));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 text-white py-24 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-display font-display font-bold mb-6 leading-tight">
              Menuiserie Artisanale
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90 font-light">
              Des meubles sur mesure, fabriqués avec passion et savoir-faire
            </p>
            <p className="text-lg mb-10 text-white/80 max-w-2xl mx-auto">
              Découvrez notre collection de meubles en bois massif, créés par des artisans passionnés pour transformer votre intérieur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold font-accent shadow-large hover:shadow-glow hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
              >
                Découvrir nos produits
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold font-accent hover:bg-white/10 transition-all duration-300"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl hover:bg-primary-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                <FiAward className="text-2xl text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Qualité Premium</h3>
              <p className="text-gray-600 text-sm">Bois massif sélectionné avec soin</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:bg-primary-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                <FiTruck className="text-2xl text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Livraison Rapide</h3>
              <p className="text-gray-600 text-sm">Expédition sous 48h</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:bg-primary-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                <FiShield className="text-2xl text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Garantie 2 ans</h3>
              <p className="text-gray-600 text-sm">Sur tous nos produits</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:bg-primary-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                <FiAward className="text-2xl text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fait Main</h3>
              <p className="text-gray-600 text-sm">Par des artisans experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-h1 font-display font-bold mb-4 gradient-text">
              Produits en vedette
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de meubles artisanaux, créés avec passion et expertise
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg group"
                >
                  Voir tous les produits
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

