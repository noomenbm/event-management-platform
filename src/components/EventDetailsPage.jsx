import { useEventQuery } from '../queries/events';

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const EventDetailsPage = ({ eventId, onBack, onBook }) => {
  const {
    data: event,
    error,
    isLoading,
    refetch,
  } = useEventQuery(eventId);

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
          <p>{error.message || 'Something went wrong while loading event details.'}</p>
          <button className="retry-button" type="button" onClick={() => refetch()}>Retry</button>
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

            <div className="booking-action-row">
              <button className="primary-button" type="button" onClick={onBook}>
                Book Now
              </button>
            </div>
          </div>
        </article>

        <aside className="ticket-panel" aria-labelledby="ticket-types-title">
          <h2 id="ticket-types-title">Ticket Types</h2>
          <div className="ticket-type-list">
            {event.ticketTypes.map((ticket) => (
              <div className="ticket-type-row" key={ticket.id}>
                <div>
                  <h3>{ticket.name}</h3>
                  <p>{ticket.available} available</p>
                </div>
                <strong>{ticket.price === 0 ? 'Free' : `$${ticket.price}`}</strong>
              </div>
            ))}
          </div>
          <button className="primary-button full-width" type="button" onClick={onBook}>
            Book Now
          </button>
        </aside>
      </section>
    </div>
  );
};
