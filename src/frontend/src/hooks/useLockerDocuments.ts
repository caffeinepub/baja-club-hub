import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { LockerDocument } from '../backend';

export function useGetAllDocuments() {
  const { actor, isFetching } = useActor();

  return useQuery<LockerDocument[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document: LockerDocument) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDocument(document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
