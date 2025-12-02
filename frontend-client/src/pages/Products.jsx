import { useState, useEffect, useMemo } from 'react';
import { productsAPI } from '../api/products';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';
import Input from '../components/common/Input';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name'); // name, price_asc, price_desc
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const productsList = Array.isArray(response) ? response : (response.data || []);
      setAllProducts(productsList);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      const categoriesList = Array.isArray(response) ? response : (response.data || []);
      setCategories(categoriesList);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Filtrage et tri côté client en temps réel
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filtre par recherche (nom, description, marque) - temps réel
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameMatch = product.name?.toLowerCase().includes(searchLower);
        const descMatch = product.description?.toLowerCase().includes(searchLower);
        const brandMatch = product.brand?.toLowerCase().includes(searchLower);
        return nameMatch || descMatch || brandMatch;
      });
    }

    // Filtre par catégorie
    if (filters.category_id) {
      filtered = filtered.filter(product => {
        const categoryId = product.category_id || product.category?.id;
        return categoryId?.toString() === filters.category_id.toString();
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return filtered;
  }, [allProducts, filters.search, filters.category_id, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  if (loading && !allProducts.length) return <Loading />;

  const hasActiveFilters = filters.search || filters.category_id;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Nos Produits</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4 w-full">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md sticky top-20 lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <FiFilter />
                Filtres
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={() => setFilters({ search: '', category_id: '' })}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  title="Réinitialiser les filtres"
                >
                  <FiX />
                  Réinitialiser
                </button>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                className="input-field"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:w-3/4 w-full">
          {loading ? (
            <Loading />
          ) : (
            <>
              {/* Toolbar avec tri */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="text-sm text-gray-600">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Trier par:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="name">Nom (A-Z)</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500 text-base sm:text-lg mb-4">Aucun produit trouvé</p>
                  {hasActiveFilters && (
                    <button
                      onClick={() => setFilters({ search: '', category_id: '' })}
                      className="text-primary-600 hover:text-primary-700 underline text-sm sm:text-base"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;

