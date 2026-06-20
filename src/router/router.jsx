import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { BookEventPage } from '../pages/BookEventPage';
import { CreateEventPage } from '../pages/CreateEventPage';
import { ErrorPage } from '../pages/ErrorPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { EventsPage } from '../pages/EventsPage';
import { MyBookingsPage } from '../pages/MyBookingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { bookingAction, createEventAction } from './actions';
import {
  bookingEventLoader,
  eventDetailsLoader,
  eventsLoader,
  myBookingsLoader,
  profileLoader,
} from './loaders';

export const createAppRouter = (queryClient) => createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/events" replace />,
      },
      {
        path: 'events',
        element: <EventsPage />,
        loader: eventsLoader(queryClient),
        errorElement: <ErrorPage />,
      },
      {
        path: 'events/:id',
        element: <EventDetailsPage />,
        loader: eventDetailsLoader(queryClient),
        errorElement: <ErrorPage />,
      },
      {
        path: 'book/:eventId',
        element: <BookEventPage />,
        loader: bookingEventLoader(queryClient),
        action: bookingAction(queryClient),
        errorElement: <ErrorPage />,
      },
      {
        path: 'my-bookings',
        element: <MyBookingsPage />,
        loader: myBookingsLoader(queryClient),
        errorElement: <ErrorPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
        loader: profileLoader(queryClient),
        errorElement: <ErrorPage />,
      },
      {
        path: 'create-event',
        element: <CreateEventPage />,
        action: createEventAction(queryClient),
        errorElement: <ErrorPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
