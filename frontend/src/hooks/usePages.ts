import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function usePages() {
  const query = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const res = await api.get('/pages');
      console.log('API response:', res.data);

      if (res.data.success) {
        // always return array
        return Array.isArray(res.data.data) ? res.data.data : [];
      } else {
        throw new Error(res.data.error || 'Failed to fetch pages');
      }
    },
  });

  const getPageById = async (id: string) => {
    const res = await api.get(`/pages/${id}`);
    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.error || 'Failed to fetch page');
    }
  };

  return { ...query, getPageById };
}
