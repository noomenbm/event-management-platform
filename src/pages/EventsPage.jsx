import { useNavigate } from 'react-router-dom';
import { EventsPage as EventsPageContent } from '../components/EventsPage';

export const EventsPage = () => {
  const navigate = useNavigate();

  return (
    <EventsPageContent onSelectEvent={(eventId) => navigate(`/events/${eventId}`)} />
  );
};
