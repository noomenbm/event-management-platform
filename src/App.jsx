import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { EventsPage } from './pages/EventsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const currentPage = location.pathname.startsWith('/my-bookings') ? 'bookings' : 'events';

  const setCurrentPage = (page) => {
    if (page === 'bookings') {
      navigate('/my-bookings');
      return;
    }

    navigate('/events');
  };

  return (
    <div className="app-container">
      {/* Header and navigation */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main app layout area */}
      <main className="main-content">
        <Routes>
          <Route index element={<Navigate to="/events" replace />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage showToast={showToast} />} />
          <Route path="my-bookings" element={<MyBookingsPage showToast={showToast} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
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
