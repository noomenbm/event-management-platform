import { useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { EventsPage } from './components/EventsPage';
import { EventDetailsPage } from './components/EventDetailsPage';
import { MyBookingsPage } from './components/MyBookingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('events');
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    setCurrentPage('event-details');
  };

  const handleBackToEvents = () => {
    setSelectedEventId(null);
    setCurrentPage('events');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'events':
        return <EventsPage onSelectEvent={handleSelectEvent} />;
      case 'event-details':
        return (
          <EventDetailsPage
            eventId={selectedEventId}
            onBack={handleBackToEvents}
            onViewBookings={() => setCurrentPage('bookings')}
          />
        );
      case 'bookings':
        return <MyBookingsPage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Header and navigation */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main app layout area */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Elegant student assignment footer */}
      <footer className="app-footer">
        <div className="container">
          <p>Copyright 2026 VibeVent Platform. Developed for React Project Assignment-1.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
