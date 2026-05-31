import { createPortal } from 'react-dom';

export const Toast = ({ toast }) => {
  if (!toast.message) return null;

  return createPortal(
    <div className={`toast toast-${toast.type}`} role="status">
      {toast.message}
    </div>,
    document.body
  );
};
