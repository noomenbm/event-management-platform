import { useEffect, useReducer, useState } from 'react';
import { api } from '../services/api';
import { bookingReducer, initialBookingState } from '../reducers/bookingReducer';

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-()\s]{7,15}$/;

export const EventDetailsPage = ({ eventId, onBack, onViewBookings, showToast }) => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [bookingState, dispatch] = useReducer(bookingReducer, initialBookingState);

  const fetchEventDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getEventById(eventId);
      setEvent(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading event details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetching event details on mount is required for GET /events/:id.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const getTicketQuantity = (ticketId) => bookingState.quantities[ticketId] || 0;

  const handleQuantityChange = (ticket, changeAmount) => {
    const currentQuantity = getTicketQuantity(ticket.id);
    const nextQuantity = Math.max(0, Math.min(ticket.available, currentQuantity + changeAmount));

    dispatch({
      type: 'SET_TICKET_QUANTITY',
      ticketId: ticket.id,
      quantity: nextQuantity,
    });
  };

  const selectedTicketCount = event
    ? event.ticketTypes.reduce((total, ticket) => total + getTicketQuantity(ticket.id), 0)
    : 0;

  const totalPrice = event
    ? event.ticketTypes.reduce((total, ticket) => total + getTicketQuantity(ticket.id) * ticket.price, 0)
    : 0;

  const selectedTickets = event
    ? event.ticketTypes
      .map((ticket) => ({
        ...ticket,
        quantity: getTicketQuantity(ticket.id),
      }))
      .filter((ticket) => ticket.quantity > 0)
    : [];

  const handleAttendeeChange = (index, field, value) => {
    dispatch({
      type: 'UPDATE_ATTENDEE',
      index,
      field,
      value,
    });
  };

  const validateAttendees = () => {
    const errors = {};

    bookingState.attendees.forEach((attendee, index) => {
      if (!attendee.name.trim()) {
        errors[`attendee-${index}-name`] = 'Name is required.';
      }

      if (!emailPattern.test(attendee.email)) {
        errors[`attendee-${index}-email`] = 'Enter a valid email address.';
      }

      if (!phonePattern.test(attendee.phone)) {
        errors[`attendee-${index}-phone`] = 'Enter a valid phone number.';
      }
    });

    dispatch({ type: 'SET_ERRORS', errors });
    return Object.keys(errors).length === 0;
  };

  const handleAttendeeContinue = () => {
    if (validateAttendees()) {
      dispatch({ type: 'SET_STEP', step: 3 });
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    try {
      const referenceNumber = `BK${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const booking = await api.createBooking({
        id: crypto.randomUUID(),
        userId: 'user1',
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        tickets: selectedTickets.map((ticket) => ({
          type: ticket.name,
          quantity: ticket.quantity,
          price: ticket.price,
        })),
        attendees: bookingState.attendees,
        totalAmount: totalPrice,
        status: 'confirmed',
        bookingDate: new Date().toISOString().slice(0, 10),
        referenceNumber,
      });

      dispatch({ type: 'SET_BOOKING', booking });
      showToast('Booking created successfully.');
    } catch (err) {
      dispatch({
        type: 'SET_ERRORS',
        errors: { submit: err.message || 'Unable to create booking. Please try again.' },
      });
      showToast('Unable to create booking.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPanelTitle = () => {
    if (bookingState.step === 1) return 'Select Tickets';
    if (bookingState.step === 2) return 'Attendee Details';
    return 'Review Booking';
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="details-loading">
          <div className="skeleton details-image-skeleton"></div>
          <div className="details-loading-lines">
            <div className="skeleton skeleton-line title"></div>
            <div className="skeleton skeleton-line"></div>
            <div className="skeleton skeleton-line"></div>
            <div className="skeleton skeleton-line short"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <div className="error-state-title">Event Details Failed</div>
          <p>{error}</p>
          <button className="retry-button" type="button" onClick={fetchEventDetails}>Retry</button>
          <button className="secondary-button details-secondary-action" type="button" onClick={onBack}>Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="back-button" type="button" onClick={onBack}>
        Back to Events
      </button>

      <section className="details-layout" aria-labelledby="event-details-title">
        <article className="details-main">
          <img className="details-image" src={event.image} alt={event.title} />

          <div className="details-content">
            <span className="details-category">{event.category}</span>
            <h1 id="event-details-title">{event.title}</h1>
            <p className="details-description">{event.description}</p>

            <dl className="details-list">
              <div>
                <dt>Date</dt>
                <dd>{formatDate(event.date)}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{event.time}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{event.venue}, {event.location}</dd>
              </div>
              <div>
                <dt>Organizer</dt>
                <dd>{event.organizerName}</dd>
              </div>
            </dl>
          </div>
        </article>

        <aside className="ticket-panel" aria-labelledby="tickets-title">
          <p className="step-label">Step {bookingState.step} of 3</p>
          <h2 id="tickets-title">{getPanelTitle()}</h2>

          {bookingState.step === 1 && (
            <>
              <div className="ticket-type-list">
                {event.ticketTypes.map((ticket) => (
                  <div className="ticket-type-row" key={ticket.id}>
                    <div>
                      <h3>{ticket.name}</h3>
                      <p>{ticket.available} available</p>
                    </div>
                    <strong>{ticket.price === 0 ? 'Free' : `$${ticket.price}`}</strong>
                    <div className="quantity-stepper" aria-label={`${ticket.name} quantity`}>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(ticket, -1)}
                        disabled={getTicketQuantity(ticket.id) === 0}
                      >
                        -
                      </button>
                      <span>{getTicketQuantity(ticket.id)}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(ticket, 1)}
                        disabled={getTicketQuantity(ticket.id) === ticket.available}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ticket-total-row">
                <span>{selectedTicketCount} ticket(s)</span>
                <strong>Total: ${totalPrice}</strong>
              </div>

              <button
                className="primary-button full-width"
                type="button"
                disabled={selectedTicketCount === 0}
                onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
              >
                Continue
              </button>
            </>
          )}

          {bookingState.step === 2 && (
            <>
              <div className="attendee-list">
                {bookingState.attendees.map((attendee, index) => (
                  <fieldset className="attendee-form" key={`attendee-${index + 1}`}>
                    <legend>Attendee {index + 1}</legend>
                    <label>
                      Name
                      <input
                        type="text"
                        value={attendee.name}
                        onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                        aria-invalid={Boolean(bookingState.errors[`attendee-${index}-name`])}
                      />
                      {bookingState.errors[`attendee-${index}-name`] && (
                        <span className="input-error">{bookingState.errors[`attendee-${index}-name`]}</span>
                      )}
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={attendee.email}
                        onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                        aria-invalid={Boolean(bookingState.errors[`attendee-${index}-email`])}
                      />
                      {bookingState.errors[`attendee-${index}-email`] && (
                        <span className="input-error">{bookingState.errors[`attendee-${index}-email`]}</span>
                      )}
                    </label>
                    <label>
                      Phone
                      <input
                        type="tel"
                        value={attendee.phone}
                        onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                        aria-invalid={Boolean(bookingState.errors[`attendee-${index}-phone`])}
                      />
                      {bookingState.errors[`attendee-${index}-phone`] && (
                        <span className="input-error">{bookingState.errors[`attendee-${index}-phone`]}</span>
                      )}
                    </label>
                  </fieldset>
                ))}
              </div>

              <div className="ticket-total-row">
                <span>{selectedTicketCount} ticket(s)</span>
                <strong>Total: ${totalPrice}</strong>
              </div>

              <div className="booking-action-row">
                <button className="secondary-button" type="button" onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}>
                  Back
                </button>
                <button className="primary-button" type="button" onClick={handleAttendeeContinue}>
                  Continue
                </button>
              </div>
            </>
          )}

          {bookingState.step === 3 && (
            <>
              {bookingState.booking ? (
                <div className="booking-success">
                  <h3>Booking Confirmed</h3>
                  <p>Your reference number is <strong>{bookingState.booking.referenceNumber}</strong>.</p>
                  <button className="primary-button full-width" type="button" onClick={onViewBookings}>
                    View My Bookings
                  </button>
                </div>
              ) : (
                <>
                  <div className="booking-summary">
                    <h3>{event.title}</h3>
                    <p>{formatDate(event.date)} at {event.time}</p>
                    <div className="summary-list">
                      {selectedTickets.map((ticket) => (
                        <div key={ticket.id}>
                          <span>{ticket.name} x {ticket.quantity}</span>
                          <strong>${ticket.price * ticket.quantity}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ticket-total-row">
                    <span>{selectedTicketCount} ticket(s)</span>
                    <strong>Total: ${totalPrice}</strong>
                  </div>

                  {bookingState.errors.submit && (
                    <p className="input-error">{bookingState.errors.submit}</p>
                  )}

                  <div className="booking-action-row">
                    <button className="secondary-button" type="button" onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}>
                      Back
                    </button>
                    <button className="primary-button" type="button" onClick={handleConfirmBooking} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Confirm'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </aside>
      </section>
    </div>
  );
};
