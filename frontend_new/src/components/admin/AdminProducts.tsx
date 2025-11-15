import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductFormModal from './ProductFormModal';
import axios from 'axios';
import { authService } from '../../services/authService';
import { getImageUrl } from '../../utils/constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Product {
  id: number;
  name: string;
  brand?: string;
  category: string;
  price?: number;
  unit?: string;
  description: string;
  imageUrl?: string;
  image?: string;
  stock?: number;
  isActive?: boolean;
}

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data, isLoading, refetch } = useProducts({
    search: searchQuery,
    category: selectedCategory,
    sort: 'newest',
    limit: 100,
  });

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];
  const products = data?.data || [];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: authService.getAuthHeader(),
      });
      alert('Ürün silindi');
      refetch();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ürün silinirken hata oluştu');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await axios.put(
        `${API_URL}/products/${product.id}`,
        { ...product, isActive: !product.isActive },
        { headers: authService.getAuthHeader() }
      );
      refetch();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ürün güncellenirken hata oluştu');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D47800] text-white px-4 py-2 rounded-lg hover:bg-[#B8660A] flex items-center gap-2 transition-colors duration-200"
        >
          <i className="fas fa-plus"></i>
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ara</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün adı, marka..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-[#D47800]"></i>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">Ürün bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Marka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {product.price !== null && product.price !== undefined ? (
                        <>
                          ₺{product.price.toFixed(2)}
                          <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">Fiyat yok</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.stock !== null && product.stock !== undefined ? product.stock : (
                        <span className="text-gray-400 text-xs">Stok yok</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Düzenle"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Sil"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleModalClose}
          categories={categories}
        />
      )}
    </div>
  );
};

export default AdminProducts;

