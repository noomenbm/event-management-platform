import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

export const useToggleFavoriteMutation = ({ currentUser, updateCurrentUser }) => (
  useMutation({
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
      }
    },
    onSuccess: (updatedUser) => {
      updateCurrentUser(updatedUser);
    },
  })
);
