import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const userKeys = {
  all: ['users'],
  detail: (userId) => [...userKeys.all, 'detail', userId],
};

export const useUserQuery = (userId) => (
  useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => api.getUser(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  })
);

export const useUpdateUserMutation = ({ userId, updateCurrentUser }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates) => api.updateUser(userId, updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      updateCurrentUser(updatedUser);
    },
  });
};

export const useToggleFavoriteMutation = ({ currentUser, updateCurrentUser }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteEvents) => (
      api.updateUser(currentUser.id, { favoriteEvents })
    ),
    onMutate: (favoriteEvents) => {
      const previousFavoriteEvents = currentUser.favoriteEvents || [];
      updateCurrentUser({ favoriteEvents });

      return { previousFavoriteEvents };
    },
    onError: (_error, _favoriteEvents, context) => {
      if (context?.previousFavoriteEvents) {
        updateCurrentUser({ favoriteEvents: context.previousFavoriteEvents });
        queryClient.setQueryData(userKeys.detail(currentUser.id), (user) => (
          user ? { ...user, favoriteEvents: context.previousFavoriteEvents } : user
        ));
      }
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(currentUser.id), updatedUser);
      updateCurrentUser(updatedUser);
    },
  });
};
