import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authAPI } from '../api/auth';
import { addressesAPI } from '../api/addresses';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { toast } from 'react-toastify';
import { FiUser, FiLock, FiMail, FiSave, FiMapPin, FiPlus, FiTrash2 } from 'react-icons/fi';

const profileSchema = yup.object({
  full_name: yup.string().required('Le nom complet est requis').min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
});

const passwordSchema = yup.object({
  current_password: yup.string().required('Le mot de passe actuel est requis'),
  new_password: yup.string().required('Le nouveau mot de passe est requis').min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  password_confirmation: yup.string().required('La confirmation est requise').oneOf([yup.ref('new_password')], 'Les mots de passe ne correspondent pas'),
});

const Profile = () => {
  const { user, updateProfile, changePassword, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Canada',
    type: 'shipping',
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        full_name: user.full_name || '',
        email: user.email || '',
      });
      fetchUserData();
    }
  }, [user, resetProfile]);

  const fetchUserData = async () => {
    try {
      // Récupérer les données utilisateur à jour depuis /api/auth/me
      const response = await authAPI.me();
      const userData = response.data?.user || response.user || response.data;
      
      if (userData) {
        resetProfile({
          full_name: userData.full_name || '',
          email: userData.email || '',
        });
      }

      // Récupérer les adresses
      if (user?.id) {
        setLoadingAddresses(true);
        const addressesResponse = await addressesAPI.getUserAddresses(user.id);
        const addressesList = Array.isArray(addressesResponse) 
          ? addressesResponse 
          : (addressesResponse.data || []);
        setAddresses(addressesList);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await addressesAPI.create({
        user_id: user.id,
        ...newAddress,
      });
      
      toast.success('Adresse ajoutée avec succès');
      setShowAddAddress(false);
      setNewAddress({
        street: '',
        city: '',
        province: '',
        postal_code: '',
        country: 'Canada',
        type: 'shipping',
      });
      await fetchUserData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'adresse');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      return;
    }

    try {
      setLoading(true);
      await addressesAPI.delete(addressId);
      toast.success('Adresse supprimée');
      await fetchUserData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitProfile = async (data) => {
    setError('');
    setLoading(true);
    
    try {
      const result = await updateProfile({
        full_name: data.full_name,
        email: data.email,
      });
      
      if (result.success) {
        toast.success('Profil mis à jour avec succès');
      } else {
        setError(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setError('');
    setLoading(true);
    
    try {
      const result = await changePassword(data.current_password, data.new_password);
      
      if (result.success) {
        toast.success('Mot de passe modifié avec succès');
        resetPassword();
      } else {
        setError(result.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <Loading />;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <FiUser className="inline mr-2" />
          Informations personnelles
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'password'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <FiLock className="inline mr-2" />
          Mot de passe
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <FiMapPin className="inline mr-2" />
          Adresses
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                {(user.full_name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.full_name || 'Utilisateur'}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <Input
              label="Nom complet"
              type="text"
              icon={<FiUser />}
              {...registerProfile('full_name')}
              error={profileErrors.full_name?.message}
              required
            />

            <Input
              label="Email"
              type="email"
              icon={<FiMail />}
              {...registerProfile('email')}
              error={profileErrors.email?.message}
              required
            />

            <Button
              type="submit"
              disabled={isSubmittingProfile || loading}
              loading={isSubmittingProfile || loading}
              icon={<FiSave />}
              className="w-full sm:w-auto"
            >
              Enregistrer les modifications
            </Button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
            <Input
              label="Mot de passe actuel"
              type="password"
              icon={<FiLock />}
              {...registerPassword('current_password')}
              error={passwordErrors.current_password?.message}
              required
            />

            <Input
              label="Nouveau mot de passe"
              type="password"
              icon={<FiLock />}
              {...registerPassword('new_password')}
              error={passwordErrors.new_password?.message}
              required
            />

            <Input
              label="Confirmation du nouveau mot de passe"
              type="password"
              icon={<FiLock />}
              {...registerPassword('password_confirmation')}
              error={passwordErrors.password_confirmation?.message}
              required
            />

            <Button
              type="submit"
              disabled={isSubmittingPassword || loading}
              loading={isSubmittingPassword || loading}
              icon={<FiLock />}
              className="w-full sm:w-auto"
            >
              Modifier le mot de passe
            </Button>
          </form>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FiMapPin className="text-primary-600" />
              Mes adresses
            </h2>
            <Button
              onClick={() => setShowAddAddress(!showAddAddress)}
              icon={<FiPlus />}
              variant="outline"
            >
              Ajouter une adresse
            </Button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold mb-4">Nouvelle adresse</h3>
              <Input
                label="Rue"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ville"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
                <Input
                  label="Province"
                  value={newAddress.province}
                  onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Code postal"
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  required
                />
                <Input
                  label="Pays"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  Ajouter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddAddress(false);
                    setNewAddress({
                      street: '',
                      city: '',
                      province: '',
                      postal_code: '',
                      country: 'Canada',
                      type: 'shipping',
                    });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}

          {loadingAddresses ? (
            <Loading fullScreen={false} />
          ) : addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiMapPin className="text-4xl mx-auto mb-2 text-gray-300" />
              <p>Aucune adresse enregistrée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="p-4 border border-gray-200 rounded-lg flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.province} {address.postal_code}
                    </p>
                    <p className="text-sm text-gray-500">{address.country}</p>
                    {address.type && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">
                        {address.type === 'shipping' ? 'Livraison' : address.type === 'billing' ? 'Facturation' : address.type}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-error-600 hover:text-error-700 p-2"
                    title="Supprimer l'adresse"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

