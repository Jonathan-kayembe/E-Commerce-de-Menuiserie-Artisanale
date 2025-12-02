import * as yup from 'yup';

export const registerSchema = yup.object({
  full_name: yup.string().required('Le nom complet est requis').min(3, 'Minimum 3 caractères'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().required('Le mot de passe est requis').min(8, 'Minimum 8 caractères'),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation est requise'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().required('Le mot de passe est requis'),
});

export const addressSchema = yup.object({
  street: yup.string().required('La rue est requise'),
  city: yup.string().required('La ville est requise'),
  postal_code: yup.string().required('Le code postal est requis'),
  country: yup.string().required('Le pays est requis'),
  phone: yup.string().nullable(),
  is_default: yup.boolean(),
});

export const reviewSchema = yup.object({
  rating: yup.number().required('La note est requise').min(1).max(5),
  comment: yup.string().nullable(),
});

