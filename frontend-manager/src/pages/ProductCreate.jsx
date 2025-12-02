import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';
import { imagesAPI } from '../api/images';
import { toast } from 'react-toastify';
import { productSchema } from '../utils/validation';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      is_active: true,
      stock: 0,
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      const cats = Array.isArray(response) ? response : (response.data || []);
      setCategories(cats);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Préparer les données pour l'API
      const productData = {
        name: data.name?.trim() || '',
        description: data.description?.trim() || null,
        material: data.material?.trim() || null,
        color: data.color?.trim() || null,
        finish: data.finish?.trim() || null,
        price: parseFloat(data.price) || 0,
        stock: parseInt(data.stock) || 0,
        category_id: parseInt(data.category_id) || 0,
        is_active: data.is_active === true || data.is_active === 'true' || data.is_active === 1,
      };

      // Vérifier que les champs requis sont remplis
      if (!productData.name || productData.name.length < 3) {
        toast.error('Le nom est requis et doit contenir au moins 3 caractères');
        return;
      }
      
      if (!productData.category_id || productData.category_id < 1) {
        toast.error('La catégorie est requise');
        return;
      }

      // Si une image est sélectionnée, l'uploader d'abord
      if (imageFile) {
        try {
          const uploadResponse = await imagesAPI.upload(imageFile);
          if (uploadResponse.success && uploadResponse.data?.image_url) {
            productData.image_url = uploadResponse.data.image_url;
            toast.success('Image uploadée avec succès');
          } else {
            throw new Error('Erreur lors de l\'upload de l\'image');
          }
        } catch (uploadError) {
          console.error('Erreur upload image:', uploadError);
          toast.error('Erreur lors de l\'upload de l\'image. Le produit sera créé sans image.');
        }
      }

      await productsAPI.create(productData);
      toast.success('Produit créé avec succès');
      navigate('/products');
    } catch (error) {
      console.error('Erreur onSubmit ProductCreate:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création';
      
      // Afficher les erreurs de validation détaillées
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        toast.error(errorMessages);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Nouveau produit</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 max-w-2xl">
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
            rows="4"
          />
        </div>
        <Input
          label="Matériau"
          name="material"
          {...register('material')}
        />
        <Input
          label="Couleur"
          name="color"
          {...register('color')}
        />
        <Input
          label="Finition"
          name="finish"
          {...register('finish')}
        />
        <Input
          label="Prix"
          type="number"
          step="0.01"
          name="price"
          {...register('price')}
          error={errors.price?.message}
          required
        />
        <Input
          label="Stock"
          type="number"
          name="stock"
          {...register('stock')}
          error={errors.stock?.message}
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category_id')}
            className="input-field"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          {imagePreview && (
            <div className="mb-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="input-field"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('is_active')}
              defaultChecked
            />
            <span className="text-sm font-medium text-gray-700">Produit actif</span>
          </label>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer le produit'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products')}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;

