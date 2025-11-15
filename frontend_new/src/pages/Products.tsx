import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import Pagination from '../components/common/Pagination';
import { useProducts } from '../hooks/useProducts';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Fetch products
  const itemsPerPage = 21;
  const { data, isLoading, isError } = useProducts({
    search: searchQuery,
    category: selectedCategory,
    brand: selectedBrand,
    sort: sortBy as any,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (sortBy !== 'newest') params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedBrand, sortBy, currentPage, setSearchParams]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCategory, selectedBrand, sortBy]);

  const products = data?.data || [];
  const totalCount = data?.pagination?.total || 0;

  return (
    <div>
      {/* Page Header */}
      <section className="bg-[rgba(212,120,0,0.963)] text-white py-12 backdrop-blur-[20px]" style={{
        boxShadow: '0 20px 40px rgba(212, 120, 0, 0.931), 0 2px 8px rgba(212, 120, 0, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Ürünlerimiz</h1>
          <p className="text-lg text-orange-100">
            Kaliteli ve doğal ürün seçeneklerimizi keşfedin
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selected Brand Indicator */}
          {selectedBrand && (
            <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-lg px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-tag text-[#D47800] mr-3"></i>
                <span className="text-gray-700">Seçilen Marka:</span>
                <span className="ml-2 font-semibold text-[#D47800]">
                  {selectedBrand.replace(/-/g, ' ')}
                </span>
              </div>
              <button
                onClick={() => setSelectedBrand('')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filter */}
            <div className="lg:col-span-1">
              <ProductFilter
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onBrandChange={setSelectedBrand}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Main Content - Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort & Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{totalCount}</span> ürün bulundu
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D47800] focus:border-transparent"
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="name">İsme Göre (A-Z)</option>
                  <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                  <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                </select>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="spinner"></div>
                  <span className="ml-3 text-gray-600">Ürünler yükleniyor...</span>
                </div>
              )}

              {/* Error */}
              {isError && (
                <div className="text-center py-20">
                  <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Bir hata oluştu</h3>
                  <p className="text-gray-600">Ürünler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.</p>
                </div>
              )}

              {/* No Products */}
              {!isLoading && !isError && products.length === 0 && (
                <div className="text-center py-20">
                  <i className="fas fa-box-open text-6xl text-gray-400 mb-4"></i>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
                  <p className="text-gray-600 mb-6">
                    Aradığınız kriterlere uygun ürün bulunamadı. Filtreleri değiştirmeyi deneyin.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                      setSelectedBrand('');
                      setCurrentPage(1);
                    }}
                    className="btn btn-primary"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {!isLoading && !isError && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && !isError && products.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;

