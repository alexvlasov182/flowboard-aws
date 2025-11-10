import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useDeletePage = (_p0: unknown) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/pages/${id}`);
      return res.data;
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['pages'] });
      const previousData = queryClient.getQueryData<any>(['pages']);

      queryClient.setQueryData(['pages'], (old: any) => ({
        ...old,
        data: old?.data?.filter((p: any) => p.id !== id),
      }));

      return { previousData };
    },

    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['pages'], context.previousData);
      }
      alert('Error deleting page');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};
