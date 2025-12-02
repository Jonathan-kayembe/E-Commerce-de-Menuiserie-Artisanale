import { useState, useEffect } from 'react';
import { usersAPI } from '../api/users';
import SearchBar from '../components/common/SearchBar';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/format';
import { FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import ConfirmModal from '../components/common/ConfirmModal';
import Button from '../components/common/Button';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      // Gérer différentes structures de réponse
      let usersList = [];
      if (Array.isArray(response)) {
        usersList = response;
      } else if (response?.data) {
        usersList = Array.isArray(response.data) ? response.data : [];
      } else if (response?.users) {
        usersList = Array.isArray(response.users) ? response.users : [];
      }
      
      // Filtrer par recherche et rôle si nécessaire
      let filtered = usersList;
      if (search) {
        filtered = filtered.filter(u => 
          (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
          (u.email || '').toLowerCase().includes(search.toLowerCase())
        );
      }
      if (roleFilter) {
        filtered = filtered.filter(u => u.role === roleFilter);
      }
      
      setUsers(filtered);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des utilisateurs';
      // Ne pas afficher de toast pour les erreurs 404 (endpoint peut ne pas exister)
      if (error.response?.status !== 404) {
        toast.error(errorMessage, {
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
      console.error('Erreur fetchUsers:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      setUpdating(userId);
      await usersAPI.update(userId, { is_active: !currentStatus });
      toast.success(`Utilisateur ${!currentStatus ? 'activé' : 'désactivé'}`, {
        autoClose: 3000,
        hideProgressBar: false,
      });
      fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      toast.error(errorMessage, {
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.userId) return;
    try {
      await usersAPI.delete(deleteModal.userId);
      toast.success('Utilisateur supprimé', {
        autoClose: 3000,
        hideProgressBar: false,
      });
      setDeleteModal({ isOpen: false, userId: null });
      fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      toast.error(errorMessage, {
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Utilisateurs</h1>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un utilisateur..."
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input-field w-48"
        >
          <option value="">Tous les rôles</option>
          <option value="client">Client</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.full_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'manager' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2 items-center">
                      <button
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        disabled={updating === user.id}
                        className={`${user.is_active ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-600'} disabled:opacity-50`}
                        title={user.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {user.is_active ? <FiToggleRight className="text-2xl" /> : <FiToggleLeft className="text-2xl" />}
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, userId: user.id })}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
        onConfirm={handleDelete}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};

export default Users;

