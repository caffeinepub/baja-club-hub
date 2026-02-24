import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { RequestStatus } from '../backend';

// Returns null if no request exists, or the RequestStatus if one does
export function useLockerAccessStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<RequestStatus | null>({
    queryKey: ['lockerAccessStatus'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const status = await actor.getMyLockerAccessStatus();
        return status;
      } catch (err: any) {
        // Backend throws "No request found" when user has no request yet
        const msg = err?.message ?? String(err);
        if (msg.includes('No request found') || msg.includes('no request')) {
          return null;
        }
        // If unauthorized (not logged in), return null
        if (msg.includes('Unauthorized') || msg.includes('unauthorized')) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useIsLockerAccessGranted() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['lockerAccessGranted'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isLockerAccessGrantedQuery();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSubmitLockerAccessRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitLockerAccessRequest(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockerAccessStatus'] });
      queryClient.invalidateQueries({ queryKey: ['lockerAccessGranted'] });
    },
  });
}
