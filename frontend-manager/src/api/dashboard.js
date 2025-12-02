import api from './axios';

export const dashboardAPI = {
  getStats: async () => {
    // Récupérer toutes les données nécessaires en parallèle
    const [ordersRes, productsRes, usersRes] = await Promise.all([
      api.get('/orders'),
      api.get('/products'),
      api.get('/users').catch(() => ({ data: [] })), // Gérer l'erreur si l'endpoint n'existe pas
    ]);
    
    const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.data || []);
    const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data.data || []);
    const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.data || []);
    
    // Calculer le chiffre d'affaires total
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
    
    // Compter les clients (utilisateurs avec le rôle 'client')
    const totalCustomers = users.filter(user => user.role === 'client').length;
    
    return {
      data: {
        total_revenue: totalRevenue,
        total_orders: orders.length,
        total_products: products.length,
        total_customers: totalCustomers,
      }
    };
  },

  getSales: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getTopProducts: async () => {
    const response = await api.get('/products');
    const products = Array.isArray(response.data) ? response.data : (response.data.data || []);
    // Trier par stock décroissant (simulation)
    return { data: products.slice(0, 5) };
  },
};

