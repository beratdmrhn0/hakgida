import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
}

export const authService = {
  // Login
  login: async (password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { password });
      if (response.data.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Giriş yapılırken hata oluştu'
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('adminToken');
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('adminToken');
  },

  // Get auth header
  getAuthHeader: () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

