/**
 * Nettoie le localStorage des items de panier invalides
 * À utiliser pour forcer le nettoyage du panier
 */
export const clearInvalidCartItems = () => {
  const CART_STORAGE_KEY = 'cart_items';
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      // Filtrer les items sans produit valide (doit avoir un objet product avec id et price)
      const validItems = parsedCart.filter(
        item => item.product && item.product.id && item.product.price !== undefined
      );
      
      if (validItems.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
        return { cleared: true, removed: parsedCart.length };
      } else if (validItems.length !== parsedCart.length) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
        return { cleared: true, removed: parsedCart.length - validItems.length, kept: validItems.length };
      }
      
      return { cleared: false, kept: validItems.length };
    } catch (error) {
      console.error('Erreur lors du nettoyage du panier:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
      return { cleared: true, error: true };
    }
  }
  
  return { cleared: false, noCart: true };
};

