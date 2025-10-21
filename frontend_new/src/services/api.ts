import axios from 'axios';
import type {
  Product,
  Category,
  ApiResponse,
  PaginatedResponse,
  ProductFilters,
  LoginCredentials,
  AuthResponse,
  AdminStats,
  ProductFormData,
} from '../types';

// API Base URL - development/production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  // Get all products with filters
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const { data } = await api.get(`/api/products?${params.toString()}`);
    return data;
  },

  // Get single product
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },

  // Create product (admin)
  create: async (productData: ProductFormData): Promise<ApiResponse<Product>> => {
    const { data } = await api.post('/api/products', productData);
    return data;
  },

  // Update product (admin)
  update: async (id: number, productData: Partial<ProductFormData>): Promise<ApiResponse<Product>> => {
    const { data } = await api.put(`/api/products/${id}`, productData);
    return data;
  },

  // Delete product (admin)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/api/products/${id}`);
    return data;
  },

  // Get products by category
  getByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    const { data } = await api.get(`/api/products/category/${category}`);
    return data;
  },

  // Get products by brand
  getByBrand: async (brand: string): Promise<ApiResponse<Product[]>> => {
    const { data } = await api.get(`/api/products/brand/${brand}`);
    return data;
  },

  // Search products
  search: async (query: string): Promise<ApiResponse<Product[]>> => {
    const { data } = await api.get(`/api/products/search/${query}`);
    return data;
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await api.get('/api/categories');
    return data;
  },

  // Create category (admin)
  create: async (categoryData: Partial<Category>): Promise<ApiResponse<Category>> => {
    const { data } = await api.post('/api/categories', categoryData);
    return data;
  },
};

// Admin API
export const adminApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/api/admin/login', credentials);
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },

  // Get stats
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const { data } = await api.get('/api/admin/stats');
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('admin_token');
  },

  // Check if logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_token');
  },
};

// Upload API
export const uploadApi = {
  // Upload image
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string; filename: string }>> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const { data } = await api.get('/health');
    return data.status === 'OK';
  } catch {
    return false;
  }
};

export default api;

