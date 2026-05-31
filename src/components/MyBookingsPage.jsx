import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { Modal } from './Modal';

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const MyBookingsPage = ({ showToast }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('upcoming');
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
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

  const filteredBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const eventDate = new Date(`${booking.eventDate}T00:00:00`);

      if (bookingFilter === 'upcoming') {
        return eventDate >= today && booking.status !== 'cancelled';
      }

      return eventDate < today || booking.status === 'cancelled';
    });
  }, [bookings, bookingFilter]);

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
  };

  const closeCancelModal = () => {
    setBookingToCancel(null);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);

    try {
      const cancelledBooking = await api.cancelBooking(bookingToCancel.id);
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === cancelledBooking.id ? cancelledBooking : booking
        )
      );
      closeCancelModal();
      setBookingFilter('past');
      showToast('Booking cancelled successfully.');
    } catch (err) {
      setError(err.message || 'Unable to cancel booking.');
      closeCancelModal();
      showToast('Unable to cancel booking.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="container">
      <div className="page-hero">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">View your saved reservations and booking reference numbers.</p>
      </div>

      {!isLoading && !error && bookings.length > 0 && (
        <div className="booking-filter" aria-label="Booking filter">
          <button
            className={bookingFilter === 'upcoming' ? 'active' : ''}
            type="button"
            onClick={() => setBookingFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={bookingFilter === 'past' ? 'active' : ''}
            type="button"
            onClick={() => setBookingFilter('past')}
          >
            Past
          </button>
        </div>
      )}

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

      {!isLoading && !error && bookings.length > 0 && filteredBookings.length === 0 && (
        <div className="empty-state">
          <h2 className="empty-state-title">No {bookingFilter} bookings</h2>
          <p className="empty-state-description">Bookings matching this filter will appear here.</p>
        </div>
      )}

      {!isLoading && !error && filteredBookings.length > 0 && (
        <div className="booking-list">
          {filteredBookings.map((booking) => {
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
                  {bookingFilter === 'upcoming' && booking.status === 'confirmed' && (
                    <button className="danger-button" type="button" onClick={() => openCancelModal(booking)}>
                      Cancel
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(bookingToCancel)}
        title="Cancel booking?"
        onClose={closeCancelModal}
        actions={(
          <>
            <button className="secondary-button" type="button" onClick={closeCancelModal}>
              Keep Booking
            </button>
            <button className="danger-button" type="button" onClick={handleCancelBooking} disabled={isCancelling}>
              {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
            </button>
          </>
        )}
      >
        <p>
          This will cancel your booking for {bookingToCancel?.eventTitle}. You can review it in Past bookings after it is cancelled.
        </p>
      </Modal>
    </div>
  );
};
