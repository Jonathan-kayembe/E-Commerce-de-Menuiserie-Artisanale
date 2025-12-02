import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../api/products';
import ProductTable from '../components/products/ProductTable';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      // Gérer différentes structures de réponse
      let productsList = [];
      if (Array.isArray(response)) {
        productsList = response;
      } else if (response?.data) {
        productsList = Array.isArray(response.data) ? response.data : [];
      } else if (response?.products) {
        productsList = Array.isArray(response.products) ? response.products : [];
      }
      
      // Filtrer par recherche si nécessaire
      let filtered = productsList;
      if (search) {
        filtered = productsList.filter(p => 
          (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setProducts(filtered);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des produits';
      toast.error(errorMessage);
      console.error('Erreur fetchProducts:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsAPI.delete(id);
      toast.success('Produit supprimé');
      fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      toast.error(errorMessage);
    }
  };

  if (loading && !products.length) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produits</h1>
        <Link to="/products/create">
          <Button icon={FiPlus}>Nouveau produit</Button>
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un produit..."
        />
      </div>

      <ProductTable
        products={products}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Products;

