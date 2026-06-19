import { Suspense } from 'react';
import { Await, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { EventDetailsPage as EventDetailsPageContent } from '../components/EventDetailsPage';

const RelatedEvents = ({ events }) => {
  if (!events.length) {
  return (
    <div className="related-events-panel">
      <h2 id="related-events-title">Related Events</h2>
      <p>No related events are available right now.</p>
    </div>
  );
  }

  return (
    <div className="related-events-panel">
      <h2 id="related-events-title">Related Events</h2>
      <div className="related-events-grid">
        {events.map((event) => (
          <article className="related-event-card" key={event.id}>
            <span>{event.category}</span>
            <h3>{event.title}</h3>
            <p>{event.location}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { relatedEvents } = useLoaderData();

  return (
    <>
      <EventDetailsPageContent
        eventId={id}
        onBack={() => navigate('/events')}
        onBook={() => navigate(`/book/${id}`)}
      />

      <section className="container related-events-section" aria-labelledby="related-events-title">
        <Suspense fallback={(
          <div className="related-events-panel" aria-live="polite">
            <h2 id="related-events-title">Related Events</h2>
            <div className="related-events-grid">
              {[1, 2, 3].map((item) => (
                <div className="related-event-card" key={item}>
                  <div className="skeleton skeleton-line short"></div>
                  <div className="skeleton skeleton-line title"></div>
                  <div className="skeleton skeleton-line"></div>
                </div>
              ))}
            </div>
          </div>
        )}
        >
          <Await resolve={relatedEvents}>
            {(events) => <RelatedEvents events={events} />}
          </Await>
        </Suspense>
      </section>
    </>
  );
};
