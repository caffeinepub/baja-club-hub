import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { FeedbackEntry } from '../backend';

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, message }: { category: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeedback(category, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
    },
  });
}

export function useGetAllFeedback() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const principalKey = identity?.getPrincipal().toString() ?? 'anonymous';

  return useQuery<FeedbackEntry[]>({
    queryKey: ['allFeedback', principalKey],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !actorFetching && !isInitializing,
    retry: false,
  });
}
