import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import type { ProductFilters } from '../types';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

