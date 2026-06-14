import { useNavigate, useParams } from 'react-router-dom';
import { EventDetailsPage as EventDetailsPageContent } from '../components/EventDetailsPage';

export const EventDetailsPage = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <EventDetailsPageContent
      eventId={id}
      onBack={() => navigate('/events')}
      onViewBookings={() => navigate('/my-bookings')}
      showToast={showToast}
    />
  );
};
