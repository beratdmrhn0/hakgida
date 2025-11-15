import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import KvkkPolicy from './pages/KvkkPolicy';
import QualityPolicy from './pages/QualityPolicy';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="about" element={<About />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="kvkk-policy" element={<KvkkPolicy />} />
              <Route path="quality-policy" element={<QualityPolicy />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
