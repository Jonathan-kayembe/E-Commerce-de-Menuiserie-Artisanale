import { useState, useEffect } from 'react';
import { categoriesAPI } from '../api/categories';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categorySchema } from '../utils/validation';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      // Gérer différentes structures de réponse
      let cats = [];
      if (Array.isArray(response)) {
        cats = response;
      } else if (response?.data) {
        cats = Array.isArray(response.data) ? response.data : [];
      } else if (response?.categories) {
        cats = Array.isArray(response.categories) ? response.categories : [];
      }
      setCategories(cats);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des catégories';
      toast.error(errorMessage);
      console.error('Erreur fetchCategories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await categoriesAPI.update(editingId, data);
        toast.success('Catégorie modifiée avec succès');
      } else {
        await categoriesAPI.create(data);
        toast.success('Catégorie créée avec succès');
      }
      reset();
      setEditingId(null);
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'enregistrement';
      toast.error(errorMessage);
      console.error('Erreur onSubmit categories:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setValue('name', category.name);
    setValue('description', category.description);
    setValue('slug', category.slug);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await categoriesAPI.delete(id);
        toast.success('Catégorie supprimée avec succès');
        fetchCategories();
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
        toast.error(errorMessage);
        console.error('Erreur handleDelete categories:', error);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Catégories</h1>
        <Button onClick={() => {
          reset();
          setEditingId(null);
          setShowForm(true);
        }}>
          Nouvelle catégorie
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Nom"
              name="name"
              {...register('name')}
              error={errors.name?.message}
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                className="input-field"
                rows="3"
              />
            </div>
            <Input
              label="Slug"
              name="slug"
              {...register('slug')}
              placeholder="auto-généré si vide"
            />
            <div className="flex gap-4">
              <Button type="submit">
                {editingId ? 'Modifier' : 'Créer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  reset();
                  setEditingId(null);
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {category.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.slug || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;

