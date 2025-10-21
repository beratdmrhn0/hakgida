import { useState } from 'react';
import { CATEGORIES } from '../../utils/constants';

interface ProductFilterProps {
  selectedCategory: string;
  selectedBrand: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onSearchChange: (query: string) => void;
}

const brands = [
  { id: 'harfece-bakliyat', name: 'Harfece', logo: '/assets/images/harfece.png', group: 'own' },
  { id: 'kalbak-bakliyat', name: 'Kalbak', logo: '/assets/images/kalbak.png', group: 'own' },
  { id: 'mert-kup-seker', name: 'Mert Küp Şeker', logo: '/assets/images/mgs-logo.jpg', group: 'partner' },
  { id: 'turna-yag', name: 'Turna', logo: '/assets/images/turna-logo.png', group: 'partner' },
  { id: 'cagdas-bulgur', name: 'Çağdaş Bulgur', logo: '/assets/images/cagdas-bulgur.png', group: 'partner' },
  { id: 'arbel-bulgur', name: 'Arbel', logo: '/assets/images/arbel-bulgur-bakliyat.png', group: 'partner' },
  { id: 'turkiye-seker', name: 'Türkşeker', logo: '/assets/images/turkseker-logo.webp', group: 'partner' },
  { id: 'er-mis-salca', name: 'Er Mis', logo: '/assets/images/ermis_logo.jpg', group: 'partner' },
  { id: 'ovella-makarna', name: 'Ovella', logo: '/assets/images/ova-makarna.png', group: 'partner' },
  { id: 'beypazari', name: 'Beypazarı', logo: '/assets/images/beypazarı.png', group: 'partner' },
  { id: 'caykur', name: 'Çaykur', logo: '/assets/images/caykur-logo.png', group: 'partner' },
];

const ProductFilter = ({
  selectedCategory,
  selectedBrand,
  searchQuery,
  onCategoryChange,
  onBrandChange,
  onSearchChange,
}: ProductFilterProps) => {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [brandsExpanded, setBrandsExpanded] = useState(true);

  const ownBrands = brands.filter(b => b.group === 'own');
  const partnerBrands = brands.filter(b => b.group === 'partner');

  return (
    <aside className="lg:sticky lg:top-24 space-y-6">
      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent transition-all"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <button
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          className="w-full px-4 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center font-semibold text-gray-900">
            <i className="fas fa-th-list mr-3 text-[#D47800]"></i>
            Kategoriler
          </span>
          <i className={`fas fa-chevron-down transition-transform ${categoriesExpanded ? 'rotate-180' : ''}`}></i>
        </button>

        {categoriesExpanded && (
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            <button
              onClick={() => onCategoryChange('')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                selectedCategory === ''
                  ? 'bg-orange-100 text-[#D47800] font-semibold'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              Tümü
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.key}
                onClick={() => onCategoryChange(category.key)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.key
                    ? 'bg-orange-100 text-[#D47800] font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands Filter */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <button
          onClick={() => setBrandsExpanded(!brandsExpanded)}
          className="w-full px-4 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center font-semibold text-gray-900">
            <i className="fas fa-industry mr-3 text-[#D47800]"></i>
            Markalar
          </span>
          <i className={`fas fa-chevron-down transition-transform ${brandsExpanded ? 'rotate-180' : ''}`}></i>
        </button>

        {brandsExpanded && (
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Tümü */}
            <button
              onClick={() => onBrandChange('')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                selectedBrand === ''
                  ? 'bg-orange-100 text-[#D47800] font-semibold'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              Tümü
            </button>

            {/* Kendi Ürünlerimiz */}
            <div>
              <div className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <i className="fas fa-store mr-2"></i>
                Kendi Ürünlerimiz
              </div>
              <div className="space-y-2">
                {ownBrands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => onBrandChange(brand.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      selectedBrand === brand.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" />
                    <span className="text-sm font-medium text-gray-700">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* İş Birliklerimiz */}
            <div>
              <div className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <i className="fas fa-handshake mr-2"></i>
                İş Birliklerimiz
              </div>
              <div className="space-y-2">
                {partnerBrands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => onBrandChange(brand.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      selectedBrand === brand.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" />
                    <span className="text-sm font-medium text-gray-700">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProductFilter;

