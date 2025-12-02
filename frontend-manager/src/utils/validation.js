import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().required('Le mot de passe est requis'),
});

export const registerSchema = yup.object({
  full_name: yup.string().required('Le nom complet est requis').min(3, 'Minimum 3 caractères'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().required('Le mot de passe est requis').min(8, 'Minimum 8 caractères'),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation est requise'),
});

export const productSchema = yup.object({
  name: yup.string().required('Le nom est requis').min(3, 'Minimum 3 caractères'),
  description: yup.string().nullable(),
  material: yup.string().nullable(),
  color: yup.string().nullable(),
  finish: yup.string().nullable(),
  price: yup.number().positive('Le prix doit être positif').required('Le prix est requis'),
  stock: yup.number().integer().min(0).required('Le stock est requis'),
  category_id: yup.number().required('La catégorie est requise'),
  is_active: yup.boolean(),
});

export const categorySchema = yup.object({
  name: yup.string().required('Le nom est requis').min(3, 'Minimum 3 caractères'),
  description: yup.string().nullable(),
  slug: yup.string().nullable(),
});

