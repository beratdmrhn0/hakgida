// Product Types
export interface Product {
  id: number;
  name: string;
  category: string;
  brand?: string;
  type?: string;
  price?: number;
  unit?: string;
  description: string;
  image?: string;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  brand?: string;
  type?: string;
  price?: number;
  description: string;
  image?: string;
  stock?: number;
}

// Category Types
export interface Category {
  id: number;
  key: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Filter Types
export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  sort?: 'price-low' | 'price-high' | 'name' | 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

// Auth Types
export interface LoginCredentials {
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  message: string;
}

// Admin Stats
export interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  categoryStats: Array<{
    category: string;
    count: number;
  }>;
}

