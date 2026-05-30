export const EventCard = ({ event, onSelect, isFavorite, onToggleFavorite }) => {
  const { id, title, description, category, date, time, location, image, ticketTypes } = event;

  // Format date to a simple readable format, e.g. "May 30, 2026"
  const formatDate = (dateStr) => {
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const dateObj = new Date(dateStr + 'T00:00:00');
      return dateObj.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  // Find the minimum ticket price to display, e.g., "From $99" or "Free"
  const getPriceDisplay = () => {
    if (!ticketTypes || ticketTypes.length === 0) return 'Free';
    const prices = ticketTypes.map(t => t.price);
    const minPrice = Math.min(...prices);
    
    if (minPrice === 0) return 'Free';
    return `From $${minPrice}`;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card navigation
    onToggleFavorite(id);
  };

  return (
    <article className="event-card" onClick={() => onSelect(id)} style={{ cursor: 'pointer' }}>
      {/* Event Header Image and Category */}
      <div className="event-card-image-wrapper">
        <span className="event-card-category-badge">{category}</span>
        
        {/* Heart/Like Icon */}
        <button
          className={`event-card-favorite-btn ${isFavorite ? 'liked' : ''}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavoriteClick}
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <img src={image} alt={title} className="event-card-image" loading="lazy" />
      </div>

      {/* Card Information Body */}
      <div className="event-card-content">
        <div className="event-card-meta">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{formatDate(date)} - {time}</span>
        </div>

        <h3 className="event-card-title">{title}</h3>
        
        <p className="event-card-description">{description}</p>

        <div className="event-card-footer">
          <div className="event-card-location">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{location}</span>
          </div>

          <div className={`event-card-price ${getPriceDisplay() === 'Free' ? 'free' : ''}`}>
            {getPriceDisplay()}
          </div>
        </div>
      </div>
    </article>
  );
};
