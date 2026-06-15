import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { EventDetailsPage as EventDetailsPageContent } from '../components/EventDetailsPage';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useOutletContext();

  return (
    <EventDetailsPageContent
      eventId={id}
      onBack={() => navigate('/events')}
      onViewBookings={() => navigate('/my-bookings')}
      showToast={showToast}
    />
  );
};
