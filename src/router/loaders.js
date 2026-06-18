import { SIMULATED_USER_ID } from '../context/AuthContext';
import { bookingKeys } from '../queries/bookings';
import { eventKeys } from '../queries/events';
import { api } from '../services/api';

const notFound = (message) => {
  throw new Response(message, { status: 404, statusText: 'Not Found' });
};

export const eventsLoader = (queryClient) => async () => {
  await queryClient.ensureQueryData({
    queryKey: eventKeys.list(),
    queryFn: () => api.getEvents(),
  });

  return null;
};

export const eventDetailsLoader = (queryClient) => async ({ params }) => {
  if (!params.id) {
    notFound('Event not found.');
  }

  await queryClient.ensureQueryData({
    queryKey: eventKeys.detail(params.id),
    queryFn: () => api.getEventById(params.id),
  });

  return null;
};

export const bookingEventLoader = (queryClient) => async ({ params }) => {
  if (!params.eventId) {
    notFound('Booking event not found.');
  }

  await queryClient.ensureQueryData({
    queryKey: eventKeys.detail(params.eventId),
    queryFn: () => api.getEventById(params.eventId),
  });

  return null;
};

export const myBookingsLoader = (queryClient) => async () => {
  await queryClient.ensureQueryData({
    queryKey: bookingKeys.list(SIMULATED_USER_ID),
    queryFn: () => api.getBookings(SIMULATED_USER_ID),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });

  return null;
};
