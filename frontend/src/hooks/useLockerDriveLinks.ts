import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DriveLink } from '../backend';

export function useGetAllDriveLinks() {
  const { actor, isFetching } = useActor();

  return useQuery<DriveLink[]>({
    queryKey: ['driveLinks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDriveLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDriveLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: DriveLink) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDriveLink(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driveLinks'] });
    },
  });
}

export function useDeleteDriveLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDriveLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driveLinks'] });
    },
  });
}
