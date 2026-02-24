import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { LockerBill } from '../backend';

export function useGetAllBills() {
  const { actor, isFetching } = useActor();

  return useQuery<LockerBill[]>({
    queryKey: ['bills'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBills();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBill() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bill: LockerBill) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBill(bill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}

export function useDeleteBill() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBill(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}
