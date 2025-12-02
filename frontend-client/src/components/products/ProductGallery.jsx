import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getImageUrl } from '../../utils/imageUrl';

const ProductGallery = ({ images = [], productName = 'Produit' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si pas d'images, utiliser une image placeholder
  // Convertir les URLs relatives en URLs absolues
  const displayImages = images.length > 0 
    ? images.map(img => getImageUrl(img))
    : ['https://via.placeholder.com/600x400?text=Produit'];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden group">
        <img
          src={displayImages[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400?text=Produit';
          }}
        />
        
        {/* Navigation précédent/suivant */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Image précédente"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Image suivante"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Indicateur d'image */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Miniatures */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} - Miniature ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Produit';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

