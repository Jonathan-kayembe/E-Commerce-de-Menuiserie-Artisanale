import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { clearInvalidCartItems } from '../../utils/clearInvalidCartItems';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiSearch, FiHome, FiPackage, FiCreditCard } from 'react-icons/fi';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount, cartItems } = useCart();
  const location = useLocation();
  const cartCount = getCartItemCount();
  const hasItems = cartItems && Array.isArray(cartItems) && cartItems.length > 0;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Nettoyer le panier au chargement si nécessaire
  useEffect(() => {
    if (isAuthenticated) {
      const result = clearInvalidCartItems();
      if (result.cleared && result.removed > 0) {
        // Forcer le rechargement du panier si des items ont été supprimés
        window.dispatchEvent(new Event('cart:refresh'));
      }
    }
  }, [isAuthenticated]);

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-display font-bold gradient-text hover:scale-105 transition-transform duration-300"
          >
            Menuiserie Artisanale
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={`relative font-medium transition-colors duration-300 ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Accueil
              {isActive('/') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></span>
              )}
            </Link>
            <Link 
              to="/products" 
              className={`relative font-medium transition-colors duration-300 ${
                isActive('/products') || location.pathname.startsWith('/products/')
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Produits
              {(isActive('/products') || location.pathname.startsWith('/products/')) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></span>
              )}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Bouton Checkout rapide si panier non vide */}
                {hasItems && location.pathname !== '/checkout' && (
                  <button
                    onClick={() => navigate('/checkout')}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                    title="Passer commande"
                  >
                    <FiCreditCard className="text-lg" />
                    <span className="hidden lg:inline">Commander</span>
                  </button>
                )}
                
                {/* Cart */}
                <Link 
                  to="/cart" 
                  className="relative p-2 rounded-lg hover:bg-primary-50 transition-all duration-300 group"
                  title="Voir le panier"
                >
                  <FiShoppingCart className="text-2xl text-gray-700 group-hover:text-primary-600 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-slow shadow-medium">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                      {(user?.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-medium text-gray-700 group-hover:text-primary-600">
                      {user?.full_name || 'Utilisateur'}
                    </span>
                  </button>
                  
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setUserMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-large border border-gray-100 overflow-hidden animate-scale-in z-20">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                          <p className="font-semibold text-gray-900">{user?.full_name || 'Utilisateur'}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors text-gray-700"
                        >
                          <FiUser className="text-primary-600" />
                          <span>Mon profil</span>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors text-gray-700"
                        >
                          <FiPackage className="text-primary-600" />
                          <span>Mes commandes</span>
                        </Link>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-50 transition-colors text-error-600"
                          >
                            <FiLogOut />
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Inscription
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <FiX className="text-2xl text-gray-700" />
              ) : (
                <FiMenu className="text-2xl text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-slide-down">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiHome />
                <span>Accueil</span>
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/products') || location.pathname.startsWith('/products/')
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiPackage />
                <span>Produits</span>
              </Link>
              {isAuthenticated && hasItems && location.pathname !== '/checkout' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/checkout');
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium mx-4"
                >
                  <FiCreditCard />
                  <span>Passer commande</span>
                </button>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary mx-4"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

