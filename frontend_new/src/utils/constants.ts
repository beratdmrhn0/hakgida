// Category Constants
export const CATEGORIES = [
  { key: 'caylar', name: 'Çaylar', icon: 'Leaf', color: '#27ae60' },
  { key: 'baklagil', name: 'Baklagil', icon: 'Sprout', color: '#e74c3c' },
  { key: 'bakliyat', name: 'Bakliyat', icon: 'Sprout', color: '#8b4513' },
  { key: 'baharat', name: 'Baharat', icon: 'Flame', color: '#f39c12' },
  { key: 'salca', name: 'Salça', icon: 'Droplet', color: '#dc2626' },
  { key: 'makarna', name: 'Makarna', icon: 'UtensilsCrossed', color: '#fbbf24' },
  { key: 'seker', name: 'Şeker', icon: 'Cube', color: '#f8fafc' },
  { key: 'yag', name: 'Yağ', icon: 'Droplets', color: '#fcd34d' },
  { key: 'icecek', name: 'İçecek', icon: 'Wine', color: '#06b6d4' },
] as const;

// Brand Logos
export const BRAND_LOGOS = [
  { name: 'Çaykur', logo: '/assets/images/caykur-logo.png' },
  { name: 'Beypazarı', logo: '/assets/images/beypazarı.png' },
  { name: 'Arbel Bulgur', logo: '/assets/images/arbel-bulgur-bakliyat.png' },
  { name: 'Ovella', logo: '/assets/images/ovella.png' },
  { name: 'Türk Şeker', logo: '/assets/images/turkseker-logo.webp' },
  { name: 'Ova Makarna', logo: '/assets/images/ova-makarna.png' },
  { name: 'Harfece', logo: '/assets/images/harfece.png' },
  { name: 'Kalbak', logo: '/assets/images/kalbak.png' },
  { name: 'Çağdaş Bulgur', logo: '/assets/images/cagdas-bulgur.png' },
  { name: 'Turna', logo: '/assets/images/turna-logo.png' },
  { name: 'MGS', logo: '/assets/images/mgs-logo.jpg' },
  { name: 'ER MİS', logo: '/assets/images/ermis_logo.jpg' },
] as const;

// Brand Names for Dropdown
export const BRAND_NAMES = BRAND_LOGOS.map(brand => brand.name);

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'name', label: 'İsme Göre (A-Z)' },
  { value: 'price-low', label: 'Fiyat (Düşük-Yüksek)' },
  { value: 'price-high', label: 'Fiyat (Yüksek-Düşük)' },
] as const;

// Company Info
export const COMPANY_INFO = {
  name: 'Hakgida',
  fullName: 'Pamuk Gıda Turizm A.Ş.',
  phone: '+90 (482) 000 00 00',
  email: 'info@hakgida.com',
  address: 'Mardin Organize Sanayi Bölgesi, Mardin, Türkiye',
  social: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    linkedin: '#',
  },
} as const;

// Carousel Images
export const CAROUSEL_IMAGES = [
  {
    image: '/assets/images/harfece-kalbak-urun-resimleri.png',
    title: '',
    subtitle: '',
    description: '',
  },
  {
    image: '/assets/images/çaykur/resim3.jpg',
    title: 'Toptan Gıda Tedarik',
    subtitle: 'Güvenilir İş Ortağınız',
    description: 'Geniş ürün yelpazesi ile işletmenizin gıda ihtiyaçlarını karşılıyoruz.',
  },
  {
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Seçkin Markalarla Çalışıyoruz',
    subtitle: 'Kaliteli Ürün Yelpazesi',
    description: 'Çaykur, Beypazarı, Türk Şeker gibi köklü markalarla birlikte, kendi üretimimiz Harfece ve Kalbak bakliyat ürünleri.',
  },
] as const;

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Default Image Placeholder
export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop';

// Image URL Helper
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return DEFAULT_PRODUCT_IMAGE;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it's a base64 image, return as is
  if (imagePath.startsWith('data:image')) return imagePath;
  
  // Otherwise, construct the full URL
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Admin Password (for demo)
export const ADMIN_PASSWORD = 'hakgida2024';

