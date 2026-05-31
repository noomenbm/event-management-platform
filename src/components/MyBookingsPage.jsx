import { useEffect, useState } from 'react';
import { api } from '../services/api';

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getBookings('user1');
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetching bookings on mount is required for GET /bookings?userId=user1.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);

  return (
    <div className="container">
      <div className="page-hero">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">View your saved reservations and booking reference numbers.</p>
      </div>

      {isLoading && (
        <div className="booking-list">
          {[1, 2].map((item) => (
            <div className="booking-card" key={item}>
              <div className="booking-card-main">
                <div className="skeleton skeleton-line title"></div>
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton skeleton-line short"></div>
              </div>
              <div className="skeleton skeleton-pill"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="error-state">
          <div className="error-state-title">Bookings Failed</div>
          <p>{error}</p>
          <button className="retry-button" type="button" onClick={fetchBookings}>Retry</button>
        </div>
      )}

      {!isLoading && !error && bookings.length === 0 && (
        <div className="empty-state">
          <h2 className="empty-state-title">No bookings yet</h2>
          <p className="empty-state-description">Your confirmed ticket bookings will appear here.</p>
        </div>
      )}

      {!isLoading && !error && bookings.length > 0 && (
        <div className="booking-list">
          {bookings.map((booking) => {
            const ticketCount = booking.tickets.reduce((total, ticket) => total + ticket.quantity, 0);

            return (
              <article className="booking-card" key={booking.id}>
                <div className="booking-card-main">
                  <span className={`status-pill ${booking.status}`}>{booking.status}</span>
                  <h2>{booking.eventTitle}</h2>
                  <p>{formatDate(booking.eventDate)} - {ticketCount} ticket(s)</p>
                  <p>Reference: {booking.referenceNumber}</p>
                </div>
                <div className="booking-card-side">
                  <strong>${booking.totalAmount}</strong>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
