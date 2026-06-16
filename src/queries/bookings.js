import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const bookingKeys = {
  all: ['bookings'],
  lists: () => [...bookingKeys.all, 'list'],
  list: (userId) => [...bookingKeys.lists(), userId],
};

export const useBookingsQuery = (userId) => (
  useQuery({
    queryKey: bookingKeys.list(userId),
    queryFn: () => api.getBookings(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  })
);

export const useCancelBookingMutation = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => api.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list(userId) });
    },
  });
};
