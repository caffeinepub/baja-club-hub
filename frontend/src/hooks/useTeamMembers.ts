import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Person } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetAllPeople() {
  const { actor, isFetching } = useActor();

  return useQuery<Person[]>({
    queryKey: ['people'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPeople();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPerson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (person: Person) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPerson(person);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

export function useUpdatePerson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, person }: { principal: Principal; person: Person }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePerson(principal, person);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

export function useRemovePerson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePerson(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}
