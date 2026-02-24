import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Achievement } from '../backend';

export function useGetAllAchievements() {
  const { actor, isFetching } = useActor();

  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAchievements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievement: Achievement) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAchievement(achievement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

export function useUpdateAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, achievement }: { title: string; achievement: Achievement }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAchievement(title, achievement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

export function useRemoveAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAchievement(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}
