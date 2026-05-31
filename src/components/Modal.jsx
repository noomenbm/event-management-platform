import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, title, children, onClose, actions }) => {
  if (!isOpen) return null;

  const titleId = `modal-title-${title.toLowerCase().replaceAll(' ', '-')}`;

  return createPortal(
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button className="modal-close-button" type="button" onClick={onClose} aria-label="Close modal">
            X
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {actions && (
          <div className="modal-actions">
            {actions}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
