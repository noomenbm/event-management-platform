# VibeVent Event Management Platform

React Project 2 - Event Management Platform.

VibeVent lets users browse events, view details, book tickets, manage bookings, create events, and edit profile preferences with modern React patterns.

## Setup

Install dependencies:

```bash
npm install
```

Start the JSON Server API:

```bash
npm run server
```

JSON Server runs from `db.json` at:

```text
http://localhost:3001
```

Start the Vite React app in a second terminal:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173/
```

The frontend uses a Vite proxy, so app requests go through `/api` and forward to JSON Server.

## Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run server
```

Starts JSON Server with `db.json`.

```bash
npm run build
```

Builds the production app.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run preview
```

Previews the production build locally.

## Routes

| Route | Purpose |
|---|---|
| `/` | Redirects to `/events` |
| `/events` | Events listing with search, filters, sort, and favorites |
| `/events/:id` | Event details with deferred related events |
| `/book/:eventId` | Three-step ticket booking flow |
| `/my-bookings` | User bookings with Upcoming, Past, and Cancelled filters |
| `/create-event` | Redux Toolkit create-event wizard |
| `/profile` | User profile and preferences |

## Implemented Features

- Events listing with card layout
- Search by title with non-blocking deferred filtering
- Category, date range, and price range filters
- Sorting by date or price
- Favorite/like events with optimistic updates
- Event details with ticket types and Book Now navigation
- Deferred related-events section on event details
- Dedicated `/book/:eventId` booking route
- Three-step booking flow with reducer state
- Dynamic attendee forms with validation
- Booking confirmation with reference number
- My Bookings page with cancellation confirmation
- Optimistic booking cancellation with rollback
- Create Event wizard with dynamic ticket types
- Create-event draft persistence in `localStorage`
- Profile page with theme preference editing
- Light/dark theme toggle with persistence
- Loading, error, empty, and success states
- Responsive desktop/mobile layout

## Project 2 Concepts Covered

- React Router data routes with loaders, actions, and `errorElement`
- Deferred route data pattern with `Suspense` and `Await`
- Route-level error page
- Navigation loading indicator with `useNavigation`
- TanStack Query for server state, caching, mutations, invalidation, and optimistic updates
- Redux Toolkit with `createSlice` for the create-event wizard
- `AuthContext` for simulated user state
- `ThemeContext` for light/dark preferences
- `useReducer` for booking flow state
- `useDeferredValue` for event search
- `useId` for accessible booking and create-event form fields
- Portals for modal and toast UI
- `localStorage` persistence for theme and create-event drafts

Booking and create-event submissions use React Router route actions. TanStack Query remains responsible for server-state caching, invalidation, and optimistic favorite/cancellation updates.

## API Endpoints Used

- `GET /events`
- `GET /events/:id`
- `POST /events`
- `GET /bookings?userId=user1`
- `POST /bookings`
- `PATCH /bookings/:id`
- `GET /users/:id`
- `PATCH /users/:id`

## Project Structure

```text
db.json
src/
  components/
  context/
  layouts/
  pages/
  queries/
  reducers/
  router/
  services/
  store/
```

## Notes

- Run `npm run server` before using API-backed features.
- The simulated authenticated user is `user1`.
- Create-event drafts are saved under `create_event_draft` in browser storage.
