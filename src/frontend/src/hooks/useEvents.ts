import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Event } from '../backend';

export function useGetAllEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Event) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, event }: { title: string; event: Event }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEvent(title, event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useRemoveEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeEvent(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
