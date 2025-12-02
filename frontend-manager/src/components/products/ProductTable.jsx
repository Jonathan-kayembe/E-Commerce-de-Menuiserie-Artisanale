import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';
import { getImageUrl } from '../../utils/imageUrl';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import ConfirmModal from '../common/ConfirmModal';

const ProductTable = ({ products, onDelete }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                Aucun produit trouvé
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr 
                key={product.id} 
                className="hover:bg-gray-50 relative"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.image_url ? getImageUrl(product.image_url) : 'https://via.placeholder.com/40'}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover mr-3"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40';
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      {product.material && (
                        <div className="text-sm text-gray-500">{product.material}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category?.name || product.category_id || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${
                    product.stock > 10 ? 'text-green-600' : 
                    product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className={`flex justify-end gap-2 transition-opacity ${
                    hoveredId === product.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                      title="Voir"
                    >
                      <FiEye className="text-xl" />
                    </Link>
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50"
                      title="Modifier"
                    >
                      <FiEdit className="text-xl" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ 
                        isOpen: true, 
                        productId: product.id, 
                        productName: product.name 
                      })}
                      className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                      title="Supprimer"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
        onConfirm={() => {
          if (deleteModal.productId) {
            onDelete(deleteModal.productId);
            setDeleteModal({ isOpen: false, productId: null, productName: '' });
          }
        }}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer le produit "${deleteModal.productName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};

export default ProductTable;

