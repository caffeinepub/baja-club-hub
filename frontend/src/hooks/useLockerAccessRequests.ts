import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { LockerAccessRequest } from '../backend';
import { Principal } from '@dfinity/principal';

export function useLockerAccessRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<LockerAccessRequest[]>({
    queryKey: ['lockerAccessRequests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getLockerAccessRequests();
      } catch (err: any) {
        const msg = err?.message ?? String(err);
        if (msg.includes('Unauthorized')) {
          return [];
        }
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useApproveLockerAccessRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requester: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.approveLockerAccessRequest(requester);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockerAccessRequests'] });
    },
  });
}

export function useDenyLockerAccessRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requester: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.denyLockerAccessRequest(requester);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockerAccessRequests'] });
    },
  });
}
