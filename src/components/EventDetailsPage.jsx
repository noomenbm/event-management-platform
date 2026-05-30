import { useEffect, useState } from 'react';
import { api } from '../services/api';

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const EventDetailsPage = ({ eventId, onBack }) => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <h2 id="tickets-title">Available Tickets</h2>
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

          <button className="primary-button full-width" type="button">
            Book Tickets
          </button>
        </aside>
      </section>
    </div>
  );
};
