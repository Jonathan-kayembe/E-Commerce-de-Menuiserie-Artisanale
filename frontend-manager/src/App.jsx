import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/common/ToastProvider';

import ManagerLayout from './components/layout/ManagerLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Users from './pages/Users';
import Stats from './pages/Stats';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider requiredRole="manager">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ManagerLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/create" element={<ProductCreate />} />
                    <Route path="/products/:id/edit" element={<ProductEdit />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastProvider />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

