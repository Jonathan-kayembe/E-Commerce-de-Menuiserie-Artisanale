import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/cart';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'cart_items';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Filtrer les items sans produit valide (doit avoir un objet product avec id et price)
        const validItems = parsedCart.filter(item => item.product && item.product.id && item.product.price !== undefined);
        
        // Si aucun item valide, vider complètement le localStorage
        if (validItems.length === 0) {
          localStorage.removeItem(CART_STORAGE_KEY);
          setCartItems([]);
        } else {
          // Nettoyer le localStorage si des items invalides ont été trouvés
          if (validItems.length !== parsedCart.length) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
          }
          setCartItems(validItems);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
        setCartItems([]);
      }
    } else {
      // S'assurer que le state est vide si pas de localStorage
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      // Si déconnecté, conserver le panier local mais ne pas synchroniser avec le backend
      // Le panier local sera synchronisé lors de la prochaine connexion
    }
  }, [isAuthenticated, user]);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cartItems]);

  // Écouter l'événement de rafraîchissement du panier
  useEffect(() => {
    const handleRefresh = () => {
      if (isAuthenticated && user) {
        fetchCart();
      }
    };
    
    window.addEventListener('cart:refresh', handleRefresh);
    return () => window.removeEventListener('cart:refresh', handleRefresh);
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      const localItems = localCart ? JSON.parse(localCart) : [];
      
      const response = await cartAPI.get(user.id);
      if (response.success && response.data) {
        setCart(response.data);
        // Récupérer les items du panier backend
        if (response.data.id) {
          const itemsResponse = await cartAPI.getCartItems(response.data.id);
          // Le backend retourne directement un tableau d'items enrichis
          const backendItems = Array.isArray(itemsResponse) ? itemsResponse : (itemsResponse.data || []);
          
          // Si on a des items locaux et que le panier backend est vide, synchroniser les items locaux
          if (localItems.length > 0 && backendItems.length === 0) {
            // Créer le panier backend s'il n'existe pas
            let currentCart = response.data;
            if (!currentCart || !currentCart.id) {
              const createResponse = await cartAPI.create(user.id);
              if (createResponse.success && createResponse.data && createResponse.data.id) {
                currentCart = createResponse.data;
                setCart(currentCart);
              }
            }
            
            // Ajouter les items locaux au panier backend
            if (currentCart && currentCart.id) {
              for (const localItem of localItems) {
                if (localItem.product_id && localItem.product) {
                  try {
                    await cartAPI.addItem(
                      currentCart.id,
                      localItem.product_id,
                      localItem.quantity || 1,
                      localItem.customization || null
                    );
                  } catch (err) {
                    console.warn('Erreur lors de la synchronisation d\'un item:', err);
                  }
                }
              }
              // Recharger le panier après synchronisation
              const updatedItemsResponse = await cartAPI.getCartItems(currentCart.id);
              const updatedItems = Array.isArray(updatedItemsResponse) ? updatedItemsResponse : (updatedItemsResponse.data || []);
              setCartItems(updatedItems);
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
            } else {
              setCartItems(backendItems);
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(backendItems));
            }
          } else {
            // Utiliser le panier backend (priorité)
            // Filtrer les items sans produit valide (doit avoir un objet product avec id et price)
            const validItems = backendItems.filter(item => item.product && item.product.id && item.product.price !== undefined);
            setCartItems(validItems);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
          }
        }
      } else {
        // Si pas de panier backend, créer un panier et synchroniser les items locaux
        if (localItems.length > 0) {
          try {
            const createResponse = await cartAPI.create(user.id);
            if (createResponse.success && createResponse.data && createResponse.data.id) {
              const newCart = createResponse.data;
              setCart(newCart);
              
              // Ajouter les items locaux au nouveau panier
              for (const localItem of localItems) {
                if (localItem.product_id && localItem.product) {
                  try {
                    await cartAPI.addItem(
                      newCart.id,
                      localItem.product_id,
                      localItem.quantity || 1,
                      localItem.customization || null
                    );
                  } catch (err) {
                    console.warn('Erreur lors de la synchronisation d\'un item:', err);
                  }
                }
              }
              
              // Recharger le panier après synchronisation
              const itemsResponse = await cartAPI.getCartItems(newCart.id);
              const items = Array.isArray(itemsResponse) ? itemsResponse : (itemsResponse.data || []);
              setCartItems(items);
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            } else {
              // Si création échoue, garder le panier local
              setCartItems(localItems);
            }
          } catch (err) {
            console.error('Erreur lors de la création du panier:', err);
            // En cas d'erreur, garder le panier local
            setCartItems(localItems);
          }
        } else {
          setCartItems([]);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      // En cas d'erreur, conserver le panier local mais filtrer les items invalides
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      if (localCart) {
        try {
          const parsedCart = JSON.parse(localCart);
          // Filtrer les items sans produit valide (doit avoir un objet product avec id et price)
          const validItems = parsedCart.filter(item => item.product && item.product.id && item.product.price !== undefined);
          setCartItems(validItems);
          // Mettre à jour le localStorage avec les items valides seulement
          if (validItems.length !== parsedCart.length) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
          }
        } catch (e) {
          console.error('Erreur parsing panier local:', e);
          setCartItems([]);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } else {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, customization = null) => {
    // Si non authentifié, ajouter au panier local
    if (!isAuthenticated || !user) {
      // Récupérer le produit pour l'ajouter au panier local
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/products/${productId}`);
        const productData = await response.json();
        const product = productData.data || productData;

        const newItem = {
          id: `local_${Date.now()}`,
          product_id: productId,
          product: product,
          quantity: quantity,
          customization: customization,
        };

        setCartItems(prev => {
          const existing = prev.find(item => 
            item.product_id === productId && 
            JSON.stringify(item.customization) === JSON.stringify(customization)
          );
          
          if (existing) {
            return prev.map(item =>
              item.id === existing.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prev, newItem];
        });

        toast.success('Article ajouté au panier');
        return { success: true };
      } catch (error) {
        toast.error('Erreur lors de l\'ajout au panier');
        return { success: false };
      }
    }

    // Si authentifié, synchroniser avec le backend
    try {
      // Récupérer ou créer le panier
      let currentCart = cart;
      
      // Si pas de panier, essayer de le récupérer d'abord
      if (!currentCart || !currentCart.id) {
        try {
          const cartResponse = await cartAPI.get(user.id);
          if (cartResponse.success && cartResponse.data && cartResponse.data.id) {
            currentCart = cartResponse.data;
            setCart(currentCart);
          }
        } catch (error) {
          // Panier n'existe pas, on va le créer
          console.log('Panier non trouvé, création en cours...');
        }
      }
      
      // Si toujours pas de panier, le créer
      if (!currentCart || !currentCart.id) {
        const createResponse = await cartAPI.create(user.id);
        if (createResponse.success && createResponse.data && createResponse.data.id) {
          currentCart = createResponse.data;
          setCart(currentCart);
        } else {
          throw new Error('Impossible de créer le panier');
        }
      }

      // Vérifier que le panier a bien un ID valide
      if (!currentCart.id || currentCart.id < 1) {
        throw new Error('ID de panier invalide');
      }

      await cartAPI.addItem(currentCart.id, productId, quantity, customization);
      await fetchCart();
      toast.success('Article ajouté au panier');
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      const message = error.response?.data?.message || error.message || 'Erreur lors de l\'ajout au panier';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateItem = async (itemId, quantity, customization = null) => {
    // Si l'item est local (commence par "local_")
    if (itemId.toString().startsWith('local_')) {
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: Math.max(1, quantity), customization }
            : item
        ).filter(item => item.quantity > 0)
      );
      toast.success('Panier mis à jour');
      return { success: true };
    }

    // Si authentifié, synchroniser avec le backend
    if (isAuthenticated && user) {
      try {
        await cartAPI.updateItem(itemId, quantity, customization);
        await fetchCart();
        toast.success('Panier mis à jour');
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || 'Erreur de mise à jour';
        toast.error(message);
        return { success: false, error: message };
      }
    }

    return { success: false };
  };

  const removeItem = async (itemId) => {
    try {
      // Si l'item est local
      if (itemId.toString().startsWith('local_')) {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
        toast.success('Article retiré du panier');
        return { success: true };
      }

      // Si authentifié, synchroniser avec le backend
      if (isAuthenticated && user) {
        try {
          await cartAPI.removeItem(itemId);
          // Recharger le panier après suppression
          await fetchCart();
          toast.success('Article retiré du panier');
          return { success: true };
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'article:', error);
          const message = error.response?.data?.message || 'Erreur de suppression';
          toast.error(message);
          return { success: false, error: message };
        }
      }

      return { success: false, error: 'Non authentifié' };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      toast.error('Erreur lors de la suppression');
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      // Si authentifié, vider d'abord le panier backend
      if (cart?.id && isAuthenticated && user) {
        try {
          await cartAPI.clear(cart.id);
          // Après suppression, réinitialiser le panier
          setCart(null);
        } catch (error) {
          console.error('Erreur lors du vidage du panier backend:', error);
          const message = error.response?.data?.message || 'Erreur lors du vidage du panier';
          toast.error(message);
          return { success: false, error: message };
        }
      }
      
      // Vider le panier local
      setCartItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      
      toast.success('Panier vidé avec succès');
      return { success: true };
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      toast.error('Erreur lors du vidage du panier');
      return { success: false };
    }
  };

  const getCartItemCount = () => {
    // Ne compter que les items avec un produit valide (doit avoir un objet product avec id et price)
    return cartItems
      .filter(item => item.product && item.product.id && item.product.price !== undefined) // Filtrer les items sans produit valide
      .reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getCartTotal = () => {
    // Ne calculer que les items avec un produit valide
    return cartItems
      .filter(item => item.product) // Filtrer les items sans produit
      .reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + price * (item.quantity || 0);
      }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        fetchCart,
        getCartItemCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

