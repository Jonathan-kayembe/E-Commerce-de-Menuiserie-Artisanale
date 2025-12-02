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
    // ET qu'on n'est pas en train de soumettre le formulaire
    if (!loading && isAuthenticated) {
      // Petit délai pour éviter les conflits avec la navigation depuis onSubmit
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 50);
      
      return () => clearTimeout(timer);
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
      const password = data.password; // Ne pas trim le password
      
      if (!email || !password) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      const result = await login(email, password);
      
      if (result.success) {
        // Attendre un court instant pour que l'état soit mis à jour
        await new Promise(resolve => setTimeout(resolve, 100));
        // Navigation vers le dashboard
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
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
            Connexion Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accès réservé aux administrateurs
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && <ErrorMessage message={error} />}
          
          <div className="space-y-4">
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
          </div>
          <div className="mt-8">
            <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/register" 
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Pas encore de compte ? Inscrivez-vous
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
