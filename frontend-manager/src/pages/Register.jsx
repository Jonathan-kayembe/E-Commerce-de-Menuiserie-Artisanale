import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../utils/validation';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import Loading from '../components/common/Loading';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState('');

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    
    try {
      const result = await registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      
      if (result.success) {
        // La navigation se fera automatiquement via le useEffect
        navigate('/dashboard', { replace: true });
      } else {
        // Si le backend retourne des erreurs de validation par champ
        if (result.errors) {
          // Afficher les erreurs dans les champs correspondants
          Object.keys(result.errors).forEach((field) => {
            const fieldErrors = result.errors[field];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              setFieldError(field, {
                type: 'server',
                message: fieldErrors[0], // Prendre le premier message d'erreur
              });
            }
          });
        }
        setError(result.error || 'Erreur d\'inscription');
      }
    } catch (err) {
      setError(err.message || 'Erreur d\'inscription');
    }
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return <Loading />;
  }

  // Ne rien afficher si déjà connecté (redirection en cours)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 font-display">
            Inscription Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Créez un compte administrateur
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && <ErrorMessage message={error} />}
          
          <div className="space-y-4">
            <Input
              label="Nom complet"
              type="text"
              {...register('full_name')}
              error={errors.full_name?.message}
              required
            />
            
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              required
            />
            
            <Input
              label="Mot de passe"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              required
            />
            
            <Input
              label="Confirmation du mot de passe"
              type="password"
              {...register('password_confirmation')}
              error={errors.password_confirmation?.message}
              required
            />
          </div>
          
          <div className="mt-8">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full justify-center"
            >
              {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/login" 
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Déjà un compte ? Connectez-vous
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

