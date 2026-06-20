import { bookingKeys } from '../queries/bookings';
import { eventKeys } from '../queries/events';
import { api } from '../services/api';

const readPayload = async (request) => {
  const formData = await request.formData();
  const payload = formData.get('payload');

  if (!payload) {
    throw new Error('Missing form payload.');
  }

  return JSON.parse(payload);
};

export const bookingAction = (queryClient) => async ({ request, params }) => {
  try {
    const booking = await readPayload(request);

    if (params.eventId && booking.eventId !== params.eventId) {
      throw new Error('Booking event mismatch.');
    }

    const createdBooking = await api.createBooking(booking);

    queryClient.setQueryData(bookingKeys.list(createdBooking.userId), (currentBookings = []) => {
      const bookingExists = currentBookings.some((currentBooking) => (
        currentBooking.id === createdBooking.id
      ));

      if (bookingExists) {
        return currentBookings.map((currentBooking) => (
          currentBooking.id === createdBooking.id ? createdBooking : currentBooking
        ));
      }

      return [...currentBookings, createdBooking];
    });
    queryClient.invalidateQueries({ queryKey: bookingKeys.list(createdBooking.userId) });

    return { booking: createdBooking };
  } catch (error) {
    return {
      error: error.message || 'Unable to create booking. Please try again.',
    };
  }
};

export const createEventAction = (queryClient) => async ({ request }) => {
  try {
    const event = await readPayload(request);
    const createdEvent = await api.createEvent(event);

    queryClient.setQueryData(eventKeys.list(), (events = []) => {
      const eventExists = events.some((currentEvent) => currentEvent.id === createdEvent.id);

      if (eventExists) {
        return events.map((currentEvent) => (
          currentEvent.id === createdEvent.id ? createdEvent : currentEvent
        ));
      }

      return [...events, createdEvent];
    });
    queryClient.setQueryData(eventKeys.detail(createdEvent.id), createdEvent);
    queryClient.invalidateQueries({ queryKey: eventKeys.lists() });

    return { event: createdEvent };
  } catch (error) {
    return {
      error: error.message || 'Unable to publish event.',
    };
  }
};
