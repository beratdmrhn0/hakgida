import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../services/api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });
};

