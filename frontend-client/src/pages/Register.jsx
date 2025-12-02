import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../utils/validation';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');

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
        // Redirection vers la page d'origine ou produits
        const from = new URLSearchParams(window.location.search).get('from') || '/products';
        navigate(from);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-display">
            Inscription
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              connectez-vous
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <ErrorMessage message={error} />}
          
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
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
