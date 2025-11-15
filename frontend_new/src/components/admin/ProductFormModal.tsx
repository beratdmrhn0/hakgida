import { useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../../services/authService';
import { BRAND_NAMES } from '../../utils/constants';
import type { Product, Category } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Props {
  product: Product | null;
  onClose: () => void;
  categories: Category[];
}

const ProductFormModal = ({ product, onClose, categories }: Props) => {
  const [formData, setFormData] = useState<Partial<Product> & { name: string; description: string; category: string }>({
    id: product?.id,
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || '',
    price: product?.price ?? null,
    unit: product?.unit || 'kg',
    description: product?.description || '',
    imageUrl: product?.imageUrl || product?.image || '',
    image: product?.image,
    stock: product?.stock ?? null,
    isActive: product?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        brand: product.brand || '',
        category: product.category,
        price: product.price ?? null,
        unit: product.unit || 'kg',
        description: product.description,
        imageUrl: product.imageUrl || product.image || '',
        image: product.image,
        stock: product.stock ?? null,
        isActive: product.isActive ?? true,
      });
      if (product.imageUrl || product.image) {
        setImagePreview(product.imageUrl || product.image || '');
      }
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value) || 0) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authService.getAuthHeader(),
      },
    });

    if (response.data.success) {
      return response.data.data.filename;
    } else {
      throw new Error(response.data.error || 'Resim yüklenemedi');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalFormData = { ...formData };

      // Convert empty values to null
      if (!finalFormData.price || finalFormData.price === 0) {
        finalFormData.price = null;
      }
      if (!finalFormData.stock || finalFormData.stock === 0) {
        finalFormData.stock = null;
      }

      // Upload image if selected
      if (selectedFile) {
        const filename = await uploadImage(selectedFile);
        finalFormData.image = filename;
      } else if (finalFormData.imageUrl) {
        // If URL is provided, use it as image
        finalFormData.image = finalFormData.imageUrl;
      }

      if (product?.id) {
        // Update existing product
        await axios.put(
          `${API_URL}/products/${product.id}`,
          finalFormData,
          { headers: authService.getAuthHeader() }
        );
        alert('Ürün güncellendi');
      } else {
        // Create new product
        await axios.post(
          `${API_URL}/products`,
          finalFormData,
          { headers: authService.getAuthHeader() }
        );
        alert('Ürün eklendi');
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'İşlem sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
                placeholder="Örn: Kuru Fasulye"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marka <span className="text-red-500">*</span>
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent bg-white"
              >
                <option value="">Marka Seçin</option>
                {BRAND_NAMES.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Birim <span className="text-red-500">*</span>
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="gr">Gram (gr)</option>
                <option value="lt">Litre (lt)</option>
                <option value="ml">Mililitre (ml)</option>
                <option value="adet">Adet</option>
                <option value="paket">Paket</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fiyat (₺) <span className="text-gray-400 text-xs">(İsteğe bağlı)</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
                placeholder="Fiyat bilgisi girilmeyecekse boş bırakın"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stok Miktarı <span className="text-gray-400 text-xs">(İsteğe bağlı)</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
                placeholder="Stok bilgisi girilmeyecekse boş bırakın"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ürün Görseli
            </label>
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#D47800] file:text-white hover:file:bg-[#B8660A]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF formatlarında maksimum 5MB
                </p>
              </div>

              {/* Image Preview */}
              {(imagePreview || formData.imageUrl) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Önizleme:</p>
                  <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || (formData.imageUrl ? `http://localhost:3001/uploads/${formData.imageUrl}` : '')}
                      alt="Ürün görseli"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* URL Input (Alternative) */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Veya görsel URL'si girin:
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
              placeholder="Ürün hakkında detaylı bilgi..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-[#D47800] border-gray-300 rounded focus:ring-[#D47800]"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
              Ürün aktif
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#D47800] text-white rounded-lg hover:bg-[#B8660A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>{product ? 'Güncelle' : 'Kaydet'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;

