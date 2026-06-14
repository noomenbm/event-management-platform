import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="container">
    <div className="empty-state">
      <h1 className="empty-state-title">Page not found</h1>
      <p className="empty-state-description">The page you are looking for does not exist.</p>
      <Link className="primary-button" to="/events">
        Back to Events
      </Link>
    </div>
  </div>
);
