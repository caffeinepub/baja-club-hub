import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Person, Achievement, Event, LockerBill, EquipmentItem, LockerDocument, DriveLink, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  // Include identity principal in query key so it re-runs when user logs in/out
  const principalKey = identity?.getPrincipal().toString() ?? 'anonymous';

  // We are still "loading" if the identity provider is initializing or the actor is being fetched
  const isStillInitializing = isInitializing || actorFetching;

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', principalKey],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    // Only run when actor is ready and we're not in the middle of initializing
    enabled: !!actor && !actorFetching && !isInitializing,
    // Always get a fresh result — never serve stale admin status
    staleTime: 0,
  });

  // isLoading: true while identity/actor is initializing OR while the query itself is running
  const isLoading = isStillInitializing || query.isLoading || query.isFetching;
  // isFetched: only true once the actor is ready AND the query has completed
  const isFetched = !isStillInitializing && !!actor && query.isFetched;

  return {
    ...query,
    isLoading,
    isFetched,
  };
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const principalKey = identity?.getPrincipal().toString() ?? 'anonymous';

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', principalKey],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !isInitializing,
    retry: false,
  });

  return {
    ...query,
    isLoading: isInitializing || actorFetching || query.isLoading,
    isFetched: !isInitializing && !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Team Members Queries
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

// Achievements Queries
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

// Events Queries
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

// Bills Queries
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

// Equipment Queries
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

// Documents Queries
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

// Drive Links Queries
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
