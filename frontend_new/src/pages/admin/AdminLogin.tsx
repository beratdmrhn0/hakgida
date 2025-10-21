import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(password);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Giriş başarısız');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D47800] rounded-full mb-4">
            <i className="fas fa-shield-alt text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Paneli</h1>
          <p className="text-gray-600">Hakgida Yönetim Sistemi</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent transition-all duration-200"
                  placeholder="Admin şifresini girin"
                  required
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#D47800] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#B8660A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D47800] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Giriş Yap</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Ana Sayfaya Dön</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            <i className="fas fa-info-circle mr-1"></i>
            Sadece yetkili personel giriş yapabilir
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

