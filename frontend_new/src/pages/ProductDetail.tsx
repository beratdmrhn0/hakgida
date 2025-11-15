import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import { DEFAULT_PRODUCT_IMAGE, getImageUrl } from '../utils/constants';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  const { data, isLoading, isError } = useProduct(Number(id));
  const product = data?.data;

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      caylar: 'Çaylar',
      baklagil: 'Baklagil',
      bakliyat: 'Bakliyat',
      bulgur: 'Bulgur',
      baharat: 'Baharat',
      salca: 'Salça',
      makarna: 'Makarna',
      seker: 'Şeker',
      yag: 'Yağ',
      icecek: 'İçecek',
      organik: 'Organik',
      kuruyemis: 'Kuruyemiş',
    };
    return labels[category] || category;
  };

  const contactForProduct = () => {
    const message = `Merhaba, ${product?.name} ürünü hakkında bilgi almak istiyorum.`;
    window.open(`https://wa.me/905554443322?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Ürün yükleniyor...</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
        <p className="text-gray-600 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Ürünlere Dön
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-[#D47800]">Ana Sayfa</Link>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            <Link to="/products" className="text-gray-500 hover:text-[#D47800]">Ürünler</Link>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            <Link to={`/products?category=${product.category}`} className="text-gray-500 hover:text-[#D47800]">
              {getCategoryLabel(product.category)}
            </Link>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div 
                className="relative bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setImageModalOpen(true)}
              >
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-96 lg:h-[600px] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <i className="fas fa-search-plus mr-2"></i>
                      Büyütmek için tıklayın
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category Badge */}
              <div>
                <Link
                  to={`/products?category=${product.category}`}
                  className="inline-flex items-center px-4 py-2 bg-orange-100 text-[#D47800] rounded-full text-sm font-semibold hover:bg-orange-200 transition-colors"
                >
                  {getCategoryLabel(product.category)}
                </Link>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

              {/* Brand */}
              {product.brand && (
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-tag mr-2"></i>
                  <span className="font-medium">{product.brand}</span>
                </div>
              )}

              {/* Price */}
              {product.price !== null && product.price !== undefined && product.price > 0 && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl px-6 py-4">
                  <div className="text-sm text-gray-600 mb-1">Fiyat</div>
                  <div className="text-3xl font-bold text-[#D47800]">
                    {product.price.toLocaleString('tr-TR')} ₺
                  </div>
                </div>
              )}

              {/* Stock */}
              {product.stock !== undefined && product.stock !== null && (
                <div className="flex items-center">
                  <i className={`fas fa-circle mr-2 text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}></i>
                  <span className="text-gray-700">
                    {product.stock > 0 ? `Stokta var (${product.stock} adet)` : 'Stokta yok'}
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ürün Açıklaması</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-6">
                <button
                  onClick={contactForProduct}
                  className="flex-1 min-w-[200px] bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <i className="fab fa-whatsapp mr-2 text-xl"></i>
                  WhatsApp ile İletişim
                </button>
                <button
                  onClick={shareProduct}
                  className="bg-gray-200 text-gray-800 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center"
                >
                  <i className="fas fa-share-alt mr-2"></i>
                  Paylaş
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {imageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

