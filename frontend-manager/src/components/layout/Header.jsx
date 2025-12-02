import { useAuth } from '../../context/AuthContext';
import { FiBell, FiUser } from 'react-icons/fi';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Tableau de bord</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <FiBell className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2">
            <FiUser className="text-gray-600" />
            <span className="text-sm font-medium">{user?.full_name || 'Manager'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

