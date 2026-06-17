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

export const useCreateBookingMutation = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking) => api.createBooking(booking),
    onSuccess: (createdBooking) => {
      queryClient.setQueryData(bookingKeys.list(userId), (currentBookings = []) => {
        const bookingExists = currentBookings.some((booking) => booking.id === createdBooking.id);

        if (bookingExists) {
          return currentBookings.map((booking) => (
            booking.id === createdBooking.id ? createdBooking : booking
          ));
        }

        return [...currentBookings, createdBooking];
      });
      queryClient.invalidateQueries({ queryKey: bookingKeys.list(userId) });
    },
  });
};

export const useCancelBookingMutation = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => api.cancelBooking(bookingId),
    onMutate: async (bookingId) => {
      const queryKey = bookingKeys.list(userId);
      await queryClient.cancelQueries({ queryKey });

      const previousBookings = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (currentBookings = []) => (
        currentBookings.map((booking) => (
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ))
      ));

      return { previousBookings };
    },
    onError: (_error, _bookingId, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(bookingKeys.list(userId), context.previousBookings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list(userId) });
    },
  });
};
