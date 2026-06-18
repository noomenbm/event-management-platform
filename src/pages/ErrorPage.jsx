import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong';

  const message = isRouteErrorResponse(error)
    ? error.data || 'The requested page could not be loaded.'
    : error?.message || 'Please try again or return to the events list.';

  return (
    <div className="container">
      <div className="error-state">
        <div className="error-state-title">{title}</div>
        <p>{message}</p>
        <Link className="primary-button" to="/events">
          Back to Events
        </Link>
      </div>
    </div>
  );
};
