import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiBarChart2,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/products', label: 'Produits', icon: FiPackage },
  { path: '/categories', label: 'Catégories', icon: FiTag },
  { path: '/orders', label: 'Commandes', icon: FiShoppingCart },
  { path: '/users', label: 'Utilisateurs', icon: FiUsers },
  { path: '/stats', label: 'Statistiques', icon: FiBarChart2 },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-50 shadow-large flex flex-col border-r border-gray-200">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Menuiserie Manager
        </h2>
        <p className="text-xs text-gray-500 mt-1">Tableau de bord</p>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-medium'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <Icon className={`text-xl ${isActive ? 'text-white' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {user && (
          <div className="px-4 py-2 bg-gray-50 rounded-lg mb-2">
            <p className="text-sm font-semibold text-gray-900">{user.full_name || 'Manager'}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-error-600 hover:bg-error-50 rounded-lg transition-all duration-300 font-medium"
        >
          <FiLogOut className="text-xl" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

