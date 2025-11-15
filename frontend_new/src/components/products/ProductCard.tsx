import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { DEFAULT_PRODUCT_IMAGE, getImageUrl } from '../../utils/constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      caylar: 'bg-green-100 text-green-800',
      baklagil: 'bg-red-100 text-red-800',
      bakliyat: 'bg-yellow-100 text-yellow-800',
      bulgur: 'bg-amber-100 text-amber-800',
      baharat: 'bg-orange-100 text-orange-800',
      salca: 'bg-red-100 text-red-800',
      makarna: 'bg-yellow-100 text-yellow-800',
      seker: 'bg-gray-100 text-gray-800',
      yag: 'bg-yellow-100 text-yellow-800',
      icecek: 'bg-blue-100 text-blue-800',
      organik: 'bg-purple-100 text-purple-800',
      kuruyemis: 'bg-brown-100 text-brown-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 h-64">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category)}`}>
            {getCategoryLabel(product.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-gray-500 mb-1 truncate">{product.brand}</p>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {product.price !== null && product.price !== undefined && product.price > 0 ? (
            <span className="text-xl font-bold text-[#D47800]">
              {product.price.toLocaleString('tr-TR')} ₺
            </span>
          ) : (
            <span className="text-sm text-gray-500">Fiyat bilgisi yok</span>
          )}

          <span className="text-[#D47800] group-hover:text-[#B8660A] font-medium flex items-center">
            Detay
            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

