import { useEffect, useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { EventsPage } from './components/EventsPage';
import { EventDetailsPage } from './components/EventDetailsPage';
import { MyBookingsPage } from './components/MyBookingsPage';
import { Toast } from './components/Toast';

function App() {
  const [currentPage, setCurrentPage] = useState('events');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (!toast.message) return undefined;

    const timerId = setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 2600);

    return () => clearTimeout(timerId);
  }, [toast.message]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

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
            showToast={showToast}
          />
        );
      case 'bookings':
        return <MyBookingsPage showToast={showToast} />;
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

      <Toast toast={toast} />
    </div>
  );
}

export default App;
