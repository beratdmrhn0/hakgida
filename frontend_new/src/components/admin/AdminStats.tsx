import { useEffect, useState } from 'react';
import axios from 'axios';
import { authService } from '../../services/authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Stats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  categoryStats: Array<{ category: string; count: number }>;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/stats`, {
          headers: authService.getAuthHeader(),
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'İstatistikler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#D47800] mb-4"></i>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <i className="fas fa-exclamation-circle mr-2"></i>
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-box text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Ürün</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeProducts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pasif Ürün</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.inactiveProducts}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-times-circle text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fas fa-chart-pie text-[#D47800]"></i>
          Kategori Dağılımı
        </h3>
        <div className="space-y-3">
          {stats.categoryStats.map((cat) => (
            <div key={cat.category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#D47800] rounded-full"></div>
                <span className="font-medium text-gray-700">{cat.category}</span>
              </div>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;

