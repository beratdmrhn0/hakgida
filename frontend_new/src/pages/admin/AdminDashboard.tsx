import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminStats from '../../components/admin/AdminStats';
import AdminProducts from '../../components/admin/AdminProducts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products'>('stats');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D47800] rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hakgida Admin</h1>
                <p className="text-xs text-gray-500">Yönetim Paneli</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <i className="fas fa-home"></i>
                <span className="hidden sm:inline">Ana Sayfa</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors duration-200"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'stats'
                  ? 'border-[#D47800] text-[#D47800]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-chart-bar mr-2"></i>
              İstatistikler
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'products'
                  ? 'border-[#D47800] text-[#D47800]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-box mr-2"></i>
              Ürün Yönetimi
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'products' && <AdminProducts />}
      </main>
    </div>
  );
};

export default AdminDashboard;

