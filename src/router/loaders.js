import { SIMULATED_USER_ID } from '../context/AuthContext';
import { bookingKeys } from '../queries/bookings';
import { eventKeys } from '../queries/events';
import { userKeys } from '../queries/users';
import { api } from '../services/api';

const notFound = (message) => {
  throw new Response(message, { status: 404, statusText: 'Not Found' });
};

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const loadRelatedEvents = async (queryClient, event) => {
  await delay(900);

  const events = await queryClient.ensureQueryData({
    queryKey: eventKeys.list(),
    queryFn: () => api.getEvents(),
  });

  return events
    .filter((candidate) => (
      candidate.id !== event.id && (
        candidate.category === event.category ||
        candidate.location === event.location
      )
    ))
    .slice(0, 3);
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

  try {
    const event = await queryClient.ensureQueryData({
      queryKey: eventKeys.detail(params.id),
      queryFn: () => api.getEventById(params.id),
    });

    return {
      relatedEvents: loadRelatedEvents(queryClient, event),
    };
  } catch {
    notFound('Event not found.');
  }
};

export const bookingEventLoader = (queryClient) => async ({ params }) => {
  if (!params.eventId) {
    notFound('Booking event not found.');
  }

  try {
    await queryClient.ensureQueryData({
      queryKey: eventKeys.detail(params.eventId),
      queryFn: () => api.getEventById(params.eventId),
    });
  } catch {
    notFound('Booking event not found.');
  }

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

export const profileLoader = (queryClient) => async () => {
  await queryClient.ensureQueryData({
    queryKey: userKeys.detail(SIMULATED_USER_ID),
    queryFn: () => api.getUser(SIMULATED_USER_ID),
    staleTime: 1000 * 60 * 5,
  });

  return null;
};
