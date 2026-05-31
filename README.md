# VibeVent Event Management Platform

React Project 1 - Event Management Platform.

VibeVent lets users browse events, filter and sort the event directory, view event details, book tickets, and manage their bookings.

## How to Run This Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start the JSON Server API

Open one terminal and run:

```bash
npm run server
```

This starts the mock backend from `db.json` on:

```text
http://localhost:3001
```

### 3. Start the React app

Open a second terminal and run:

```bash
npm run dev
```

Then open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173/
```

The React app uses a Vite proxy, so frontend requests go through `/api` and are forwarded to JSON Server.

## Available Scripts

```bash
npm run dev
```

Starts the React development server.

```bash
npm run server
```

Starts JSON Server using `db.json`.

```bash
npm run build
```

Builds the production version of the app.

```bash
npm run lint
```

Runs ESLint checks.

## Implemented Features

- Events listing with card layout
- Event search by title
- Category, date range, and price range filters
- Sorting by date and price
- Favorite/like event cards with browser storage
- Event details page with ticket types
- Three-step ticket booking flow
- Ticket quantity steppers with live total
- Dynamic attendee forms
- Attendee validation with inline errors
- Booking confirmation with reference number
- My Bookings page
- Upcoming/Past bookings filter
- Booking cancellation with confirmation modal
- Success/error toast notifications
- Light/dark theme toggle with persistence
- Loading, error, and empty states
- Responsive layout for desktop and mobile

## Technical Requirements Covered

- Component composition and props
- `useState` for UI state
- `useReducer` for booking flow state
- `useEffect` for API fetching and browser storage sync
- Context API for theme state
- `useRef` for search input autofocus
- Portals for modal and toast rendering
- Conditional rendering
- List rendering with keys
- Event handling
- Form handling and validation
- `React.memo` and `useMemo` performance examples

## API Endpoints Used

The app uses JSON Server with these endpoints:

- `GET /events`
- `GET /events/:id`
- `GET /bookings?userId=user1`
- `POST /bookings`
- `PATCH /bookings/:id`

## Project Structure

```text
db.json
src/
  components/
    EventCard.jsx
    EventDetailsPage.jsx
    EventsPage.jsx
    Modal.jsx
    MyBookingsPage.jsx
    Navbar.jsx
    Toast.jsx
  context/
    ThemeContext.jsx
  reducers/
    bookingReducer.js
  services/
    api.js
```

## Assignment Requirements

### Hands on project - 1

### Event Management Platform - Project

### Requirements Document

### Project Overview

Build an Event Management Platform where users can browse
events, book tickets, and manage their bookings.

## Core Features Required

### 1. Events Listing & Discovery

**Events Page**
Display all available events in a card-based layout
Each event card must show: title, date, location, price, and
category
Implement search by event title
Implement filters:
- Category (Technology, Music, Sports, Arts, etc.)
- Date (Upcoming, This Week, This Month)
- Price range (Free, Under $50, $50+)
Sort events by date or price
Show a "favorite/like" icon on each event card

**Event Details Page**
Display complete event information (description, date, time,
location, organizer)
Show available ticket types with pricing
Display a "Book Tickets" button

### 2. Ticket Booking

**Booking Flow**

- **Step 1: Select Tickets**
  Choose ticket type and quantity
  Show price calculation in real-time
  Display total amount
- **Step 2: Attendee Details**
  Form to collect: Name, Email, Phone for each ticket
  Validate all fields
  Show error messages for invalid inputs
- **Step 3: Confirmation**
  Display booking summary
  Show success message with booking reference number
  Button to view "My Bookings"

**Requirements:**
- Show progress indicator (Step 1 of 3, Step 2 of 3, etc.)
- Allow going back to previous steps
- Prevent moving forward if current step is invalid

### 3. My Bookings

Display list of user's bookings
Show: Event name, date, number of tickets, total amount,
booking status
Filter by: Upcoming or Past events
Ability to cancel upcoming bookings
Show confirmation dialog before cancellation

### 4. Theme Toggle

Implement Light and Dark mode
Theme toggle button in header/navigation
Theme should apply to entire application
Theme preference should persist (use browser storage)

## User Experience Requirements

- Loading indicator when fetching data
- Error messages when something goes wrong
- Empty state messages (e.g., "No events found", "No bookings yet")
- Success notification after booking or cancellation
- Responsive design (works on desktop and mobile)

### Navigation:

- Header/navbar with links to: Events, My Bookings, Profile/Theme Toggle
- Clear indication of current page

## Technical Requirements

### React Concepts to Demonstrate:

- Component composition and props
- State management (useState and useReducer for booking flow)
- Effects (useEffect for data fetching)
- Context API (for theme and user state)
- Refs (at least one use case - e.g., auto-focus search input)
- Portals (for modals or notifications)
- Conditional rendering
- List rendering with proper keys
- Event handling
- Form handling with validation
- Memo or performance optimization (at least one example)

### Styling:

Upto students to decide which framework or vanilla css to choose.

## Data Structure

Can choose a simple backend like json server to set this up locally.

### Sample JSON Server Data:

```json
{
  "events": [
    {
      "id": "1",
      "title": "React Conference 2024",
      "description": "Annual React developers conference",
      "category": "Technology",
      "date": "20240715",
      "time": "09:00 AM",
      "location": "San Francisco, CA",
      "venue": "Convention Center",
      "image": "https://via.placeholder.com/400x200",
      "organizerName": "Tech Events Inc",
      "ticketTypes": [
        { "id": "1", "name": "General", "price": 99, "available": 100 },
        { "id": "2", "name": "VIP", "price": 299, "available": 20 }
      ]
    }
  ],
  "bookings": [
    {
      "id": "1",
      "userId": "user1",
      "eventId": "1",
      "eventTitle": "React Conference 2024",
      "eventDate": "20240715",
      "tickets": [
        { "type": "General", "quantity": 2, "price": 99 }
      ],
      "attendees": [
        { "name": "John Doe", "email": "john@example.com", "phone": "1234567890" }
      ],
      "totalAmount": 198,
      "status": "confirmed",
      "bookingDate": "20240201",
      "referenceNumber": "BK123456"
    }
  ]
}
```

### Required API Interactions:

- GET /events (with optional query params for filters)
- GET /events/:id
- GET /bookings?userId=user1
- POST /bookings
- PATCH /bookings/:id (for cancellation)

## Deliverables

- Complete source code in github.
- Will be asked to explain the logic and functionalities. (that contains weightage)
