import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';
import { imagesAPI } from '../api/images';
import { toast } from 'react-toastify';
import { productSchema } from '../utils/validation';
import { getImageUrl } from '../utils/imageUrl';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [product, setProduct] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      material: '',
      color: '',
      finish: '',
      price: 0,
      stock: 0,
      category_id: '',
      is_active: true,
    },
  });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      const productData = response.data || response;
      setProduct(productData);
      
      // Réinitialiser le formulaire avec les valeurs du produit
      reset({
        name: productData.name || '',
        description: productData.description || '',
        material: productData.material || '',
        color: productData.color || '',
        finish: productData.finish || '',
        price: productData.price || 0,
        stock: productData.stock || 0,
        category_id: productData.category_id || '',
        is_active: productData.is_active !== undefined ? productData.is_active : true,
      });
      
      if (productData.image_url) {
        // Convertir l'URL relative en URL absolue pour l'aperçu
        setImagePreview(getImageUrl(productData.image_url));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Produit non trouvé';
      toast.error(errorMessage);
      console.error('Erreur fetchProduct:', error);
      if (error.response?.status === 404) {
        navigate('/products');
      }
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      
      // Préparer les données pour l'API
      const updateData = {
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
      if (!updateData.name || updateData.name.length < 3) {
        toast.error('Le nom est requis et doit contenir au moins 3 caractères');
        return;
      }
      
      if (!updateData.category_id || updateData.category_id < 1) {
        toast.error('La catégorie est requise');
        return;
      }

      // Si une nouvelle image est sélectionnée, l'uploader d'abord
      if (imageFile) {
        try {
          // Vérifier que le token est présent avant l'upload
          const token = localStorage.getItem('token');
          if (!token) {
            toast.error('Session expirée. Veuillez vous reconnecter.');
            setSaving(false);
            return;
          }

          const uploadResponse = await imagesAPI.upload(imageFile);
          if (uploadResponse.success && uploadResponse.data?.image_url) {
            updateData.image_url = uploadResponse.data.image_url;
            toast.success('Image uploadée avec succès');
          } else {
            throw new Error(uploadResponse.message || 'Erreur lors de l\'upload de l\'image');
          }
        } catch (uploadError) {
          console.error('Erreur upload image:', uploadError);
          
          // Si erreur 401/403, arrêter le processus et demander de se reconnecter
          if (uploadError.response?.status === 401 || uploadError.response?.status === 403) {
            const errorMsg = uploadError.response?.data?.message || 'Session expirée. Veuillez vous reconnecter.';
            toast.error(errorMsg);
            
            // Nettoyer le localStorage et rediriger vers login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setSaving(false);
            
            // Attendre un peu avant de rediriger pour que l'utilisateur voie le message
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            return; // Arrêter ici, ne pas continuer avec la mise à jour
          }
          
          // Pour les autres erreurs, afficher un message plus détaillé
          const errorMessage = uploadError.response?.data?.message || uploadError.message || 'Erreur inconnue lors de l\'upload';
          console.error('Détails de l\'erreur upload:', {
            status: uploadError.response?.status,
            message: errorMessage,
            data: uploadError.response?.data,
          });
          
          toast.warning(`Erreur lors de l'upload de l'image: ${errorMessage}. Le produit sera mis à jour sans changer l'image.`);
          if (product?.image_url) {
            updateData.image_url = product.image_url;
          }
        }
      } else {
        // Conserver l'image_url existante si aucune nouvelle image n'est uploadée
        if (product?.image_url) {
          updateData.image_url = product.image_url;
        }
      }

      await productsAPI.update(id, updateData);
      toast.success('Produit modifié avec succès');
      navigate('/products');
    } catch (error) {
      console.error('Erreur onSubmit ProductEdit:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la modification';
      
      // Afficher les erreurs de validation détaillées
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        toast.error(errorMessages);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Modifier le produit</h1>
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
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          {imagePreview && (
            <div className="mb-2">
              <img
                src={imagePreview}
                alt={product?.name || 'Preview'}
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
            />
            <span className="text-sm font-medium text-gray-700">Produit actif</span>
          </label>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
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

export default ProductEdit;

