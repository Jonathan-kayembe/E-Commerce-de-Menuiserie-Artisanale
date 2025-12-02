/**
 * Construit l'URL complète d'une image
 * @param {string} imageUrl - URL relative de l'image (ex: /images/products/file.jpg)
 * @returns {string} URL complète de l'image
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return 'https://via.placeholder.com/400';
  }

  // Si l'URL est déjà complète (commence par http:// ou https://), la retourner telle quelle
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Récupérer l'URL de base du backend depuis les variables d'environnement
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  
  // Enlever /api de la fin si présent pour obtenir l'URL de base
  const baseUrl = apiBaseUrl.replace('/api', '');
  
  // Construire l'URL complète
  // Si l'URL commence par /, on l'ajoute directement à baseUrl
  // Sinon, on ajoute / avant
  const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${baseUrl}${cleanUrl}`;
};

