import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home           from './pages/Home';
import Restaurants    from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Checkout       from './pages/Checkout';
import Orders         from './pages/Orders';
import OrderDetail    from './pages/OrderDetail';
import Profile        from './pages/Profile';
import Dashboard      from './pages/Dashboard';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function OwnerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'restaurant_owner') return <Navigate to="/" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/restaurants"       element={<Restaurants />} />
          <Route path="/restaurants/:id"   element={<RestaurantDetail />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/checkout"          element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/orders"            element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/orders/:id"        element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="/profile"           element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/dashboard"         element={<OwnerRoute><Dashboard /></OwnerRoute>} />
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '.875rem',
              boxShadow: '0 8px 30px rgba(0,0,0,.12)',
            },
            success: { iconTheme: { primary: '#48BB78', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#FC4949', secondary: '#fff' } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
