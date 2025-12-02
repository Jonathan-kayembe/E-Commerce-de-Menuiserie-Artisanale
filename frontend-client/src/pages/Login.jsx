import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../utils/validation';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import Loading from '../components/common/Loading';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState('');

  // Rediriger si déjà connecté (mais pas pendant la soumission du formulaire)
  useEffect(() => {
    // Ne rediriger que si on est authentifié ET que le loading est terminé
    if (!loading && isAuthenticated) {
      // Redirection vers la page d'origine ou produits
      const from = new URLSearchParams(window.location.search).get('from') || '/products';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    
    try {
      // S'assurer que les credentials sont bien formatés
      const email = data.email.trim();
      const password = data.password; // Ne pas trim le password (peut contenir des espaces intentionnels)
      
      if (!email || !password) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      const result = await login(email, password);
      
      if (result.success) {
        // Redirection vers la page d'origine ou produits
        const from = new URLSearchParams(window.location.search).get('from') || '/products';
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      // Gérer spécifiquement les erreurs de rate limiting
      let errorMessage = err.response?.data?.message || err.message || 'Erreur de connexion';
      
      if (err.response?.status === 429) {
        errorMessage = errorMessage || 'Trop de tentatives de connexion. Veuillez patienter quelques instants avant de réessayer.';
      }
      
      setError(errorMessage);
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
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-display">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              créez un compte
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <ErrorMessage message={error} />}
          
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
            autoComplete="email"
          />
          
          <Input
            label="Mot de passe"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            required
            autoComplete="current-password"
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
