import { useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { EventsPage } from './components/EventsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('events');

  const handleSelectEvent = (id) => {
    alert(`Selected Event ID: ${id}. The Event Details Page and Ticket Selection stepper are coming up in Phase 4!`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'events':
        return <EventsPage onSelectEvent={handleSelectEvent} />;
      case 'bookings':
        return (
          <div className="container">
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>My Bookings</h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 32px' }}>
                View and manage your upcoming tickets and cancellation history here.
              </p>
              <div style={{
                display: 'inline-block',
                padding: '24px 40px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  Booked tickets list will load in Phase 6.
                </p>
              </div>
            </div>
          </div>
        );
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
