import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Toast } from '../components/Toast';

export const RootLayout = () => {
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

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Outlet context={{ showToast }} />
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Copyright 2026 VibeVent Platform. Developed for React Project Assignment-1.</p>
        </div>
      </footer>

      <Toast toast={toast} />
    </div>
  );
};
