import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { EquipmentItem } from '../backend';

export function useGetAllEquipment() {
  const { actor, isFetching } = useActor();

  return useQuery<EquipmentItem[]>({
    queryKey: ['equipment'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEquipment();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEquipment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (equipment: EquipmentItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEquipment(equipment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}

export function useDeleteEquipment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEquipment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}
