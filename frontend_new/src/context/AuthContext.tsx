import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    setIsAuthenticated(authService.isAuthenticated());
    setLoading(false);
  }, []);

  const login = async (password: string) => {
    const result = await authService.login(password);
    if (result.success) {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

