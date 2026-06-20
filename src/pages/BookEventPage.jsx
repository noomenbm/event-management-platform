import { useEffect, useId, useReducer, useRef } from 'react';
import { useFetcher, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEventQuery } from '../queries/events';
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

export const BookEventPage = () => {
  const attendeeFormId = useId();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useOutletContext();
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [bookingState, dispatch] = useReducer(bookingReducer, initialBookingState);
  const bookingFetcher = useFetcher();
  const lastActionResultRef = useRef(null);
  const {
    data: event,
    error,
    isLoading,
    refetch,
  } = useEventQuery(eventId);
  const actionBooking = bookingFetcher.data?.booking;
  const actionError = bookingFetcher.data?.error;
  const confirmedBooking = actionBooking || bookingState.booking;
  const isSubmittingBooking = bookingFetcher.state !== 'idle';

  useEffect(() => {
    if (!bookingFetcher.data || lastActionResultRef.current === bookingFetcher.data) return;

    lastActionResultRef.current = bookingFetcher.data;

    if (bookingFetcher.data.booking) {
      showToast('Booking created successfully.');
      return;
    }

    if (bookingFetcher.data.error) {
      showToast('Unable to create booking.', 'error');
    }
  }, [bookingFetcher.data, showToast]);

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
    const referenceNumber = `BK${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const booking = {
      id: crypto.randomUUID(),
      userId,
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
    };
    const formData = new FormData();
    formData.set('payload', JSON.stringify(booking));

    bookingFetcher.submit(formData, {
      method: 'post',
      action: `/book/${event.id}`,
    });
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
          <div className="error-state-title">Booking Event Failed</div>
          <p>{error.message || 'Something went wrong while loading event details.'}</p>
          <button className="retry-button" type="button" onClick={() => refetch()}>Retry</button>
          <button className="secondary-button details-secondary-action" type="button" onClick={() => navigate('/events')}>Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="back-button" type="button" onClick={() => navigate(`/events/${event.id}`)}>
        Back to Event Details
      </button>

      <section className="details-layout" aria-labelledby="booking-title">
        <article className="details-main">
          <img className="details-image" src={event.image} alt={event.title} />

          <div className="details-content">
            <span className="details-category">{event.category}</span>
            <h1 id="booking-title">Book {event.title}</h1>
            <p className="details-description">{formatDate(event.date)} at {event.time}</p>
            <dl className="details-list">
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
                    <label htmlFor={`${attendeeFormId}-attendee-${index}-name`}>
                      Name
                      <input
                        id={`${attendeeFormId}-attendee-${index}-name`}
                        type="text"
                        value={attendee.name}
                        onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                        aria-invalid={Boolean(bookingState.errors[`attendee-${index}-name`])}
                        aria-describedby={
                          bookingState.errors[`attendee-${index}-name`]
                            ? `${attendeeFormId}-attendee-${index}-name-error`
                            : undefined
                        }
                      />
                      {bookingState.errors[`attendee-${index}-name`] && (
                        <span className="input-error" id={`${attendeeFormId}-attendee-${index}-name-error`}>
                          {bookingState.errors[`attendee-${index}-name`]}
                        </span>
                      )}
                    </label>
                    <label htmlFor={`${attendeeFormId}-attendee-${index}-email`}>
                      Email
                      <input
                        id={`${attendeeFormId}-attendee-${index}-email`}
                        type="email"
                        value={attendee.email}
                        onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                        aria-invalid={Boolean(bookingState.errors[`attendee-${index}-email`])}
                        aria-describedby={
                          bookingState.errors[`attendee-${index}-email`]
                            ? `${attendeeFormId}-attendee-${index}-email-error`
                            : undefined
                        }
                      />
                      {bookingState.errors[`attendee-${index}-email`] && (
                        <span className="input-error" id={`${attendeeFormId}-attendee-${index}-email-error`}>
                          {bookingState.errors[`attendee-${index}-email`]}
                        </span>
                      )}
                    </label>
                    <label htmlFor={`${attendeeFormId}-attendee-${index}-phone`}>
                      Phone
                      <input
                        id={`${attendeeFormId}-attendee-${index}-phone`}
                        type="tel"
                        value={attendee.phone}
                        onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                        aria-invalid={Boolean(bookingState.errors[`attendee-${index}-phone`])}
                        aria-describedby={
                          bookingState.errors[`attendee-${index}-phone`]
                            ? `${attendeeFormId}-attendee-${index}-phone-error`
                            : undefined
                        }
                      />
                      {bookingState.errors[`attendee-${index}-phone`] && (
                        <span className="input-error" id={`${attendeeFormId}-attendee-${index}-phone-error`}>
                          {bookingState.errors[`attendee-${index}-phone`]}
                        </span>
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
              {confirmedBooking ? (
                <div className="booking-success">
                  <h3>Booking Confirmed</h3>
                  <p>Your reference number is <strong>{confirmedBooking.referenceNumber}</strong>.</p>
                  <button className="primary-button full-width" type="button" onClick={() => navigate('/my-bookings')}>
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

                  {(bookingState.errors.submit || actionError) && (
                    <p className="input-error">{bookingState.errors.submit || actionError}</p>
                  )}

                  <div className="booking-action-row">
                    <button className="secondary-button" type="button" onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}>
                      Back
                    </button>
                    <button className="primary-button" type="button" onClick={handleConfirmBooking} disabled={isSubmittingBooking}>
                      {isSubmittingBooking ? 'Saving...' : 'Confirm'}
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
