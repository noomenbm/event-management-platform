import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookingsQuery, useCancelBookingMutation } from '../queries/bookings';
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
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [bookingFilter, setBookingFilter] = useState('upcoming');
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const {
    data: bookings = [],
    error,
    isLoading,
    refetch,
  } = useBookingsQuery(userId);
  const cancelBookingMutation = useCancelBookingMutation(userId);

  const filteredBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const eventDate = new Date(`${booking.eventDate}T00:00:00`);

      if (bookingFilter === 'upcoming') {
        return eventDate >= today && booking.status !== 'cancelled';
      }

      if (bookingFilter === 'past') {
        return eventDate < today && booking.status !== 'cancelled';
      }

      return booking.status === 'cancelled';
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

    try {
      await cancelBookingMutation.mutateAsync(bookingToCancel.id);
      closeCancelModal();
      setBookingFilter('cancelled');
      showToast('Booking cancelled successfully.');
    } catch {
      closeCancelModal();
      showToast('Unable to cancel booking.', 'error');
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
          <button
            className={bookingFilter === 'cancelled' ? 'active' : ''}
            type="button"
            onClick={() => setBookingFilter('cancelled')}
          >
            Cancelled
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
          <p>{error.message || 'Something went wrong while loading bookings.'}</p>
          <button className="retry-button" type="button" onClick={() => refetch()}>Retry</button>
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
            const eventDate = new Date(`${booking.eventDate}T00:00:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const canCancelBooking = eventDate >= today && booking.status === 'confirmed';

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
                  {canCancelBooking && (
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
            <button className="danger-button" type="button" onClick={handleCancelBooking} disabled={cancelBookingMutation.isPending}>
              {cancelBookingMutation.isPending ? 'Cancelling...' : 'Confirm Cancel'}
            </button>
          </>
        )}
      >
        <p>
          This will cancel your booking for {bookingToCancel?.eventTitle}. You can review it in Cancelled bookings after it is cancelled.
        </p>
      </Modal>
    </div>
  );
};
