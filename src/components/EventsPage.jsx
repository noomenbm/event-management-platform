import { useState, useDeferredValue, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEventsQuery } from '../queries/events';
import { useToggleFavoriteMutation } from '../queries/users';
import { EventCard } from './EventCard';

export const EventsPage = ({ onSelectEvent }) => {
  const { currentUser, updateCurrentUser } = useAuth();
  const {
    data: events = [],
    error,
    isLoading,
    refetch,
  } = useEventsQuery();

  // Search, Category, and Favorites states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [selectedPriceTier, setSelectedPriceTier] = useState('All');
  const [selectedSort, setSelectedSort] = useState('date-asc');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const favoriteEvents = currentUser.favoriteEvents || [];
  const toggleFavoriteMutation = useToggleFavoriteMutation({ currentUser, updateCurrentUser });

  // useRef to autofocus the search input
  const searchInputRef = useRef(null);

  // Autofocus the search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isLoading]);

  const toggleFavorite = (eventId) => {
    const nextFavoriteEvents = favoriteEvents.includes(eventId)
      ? favoriteEvents.filter((id) => id !== eventId)
      : [...favoriteEvents, eventId];

    toggleFavoriteMutation.mutate(nextFavoriteEvents);
  };

  // Perform search, category, date, price filtering, and sorting dynamically
  const filteredEvents = useMemo(() => {
    let result = [...events];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    const getLowestTicketPrice = (event) => {
      if (!event.ticketTypes || event.ticketTypes.length === 0) return 0;
      return Math.min(...event.ticketTypes.map(ticket => ticket.price));
    };

    const isInSelectedDateRange = (eventDateStr) => {
      if (selectedDateRange === 'All') return true;

      const eventDate = new Date(`${eventDateStr}T00:00:00`);

      if (selectedDateRange === 'Upcoming') {
        return eventDate >= today;
      }

      if (selectedDateRange === 'This Week') {
        return eventDate >= today && eventDate <= weekEnd;
      }

      if (selectedDateRange === 'This Month') {
        return (
          eventDate >= today &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      }

      return true;
    };

    const isInSelectedPriceTier = (event) => {
      if (selectedPriceTier === 'All') return true;

      const lowestPrice = getLowestTicketPrice(event);

      if (selectedPriceTier === 'Free') return lowestPrice === 0;
      if (selectedPriceTier === 'Under $50') return lowestPrice > 0 && lowestPrice < 50;
      if (selectedPriceTier === '$50+') return lowestPrice >= 50;

      return true;
    };

    // 1. Filter by search query
    if (deferredSearchQuery.trim() !== '') {
      result = result.filter(e => 
        e.title.toLowerCase().includes(deferredSearchQuery.toLowerCase())
      );
    }

    // 2. Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }

    // 3. Filter by dynamic date range
    result = result.filter(e => isInSelectedDateRange(e.date));

    // 4. Filter by pricing tier
    result = result.filter(e => isInSelectedPriceTier(e));

    // 5. Sort by date or price
    result.sort((firstEvent, secondEvent) => {
      if (selectedSort === 'date-asc') {
        return new Date(`${firstEvent.date}T00:00:00`) - new Date(`${secondEvent.date}T00:00:00`);
      }

      if (selectedSort === 'date-desc') {
        return new Date(`${secondEvent.date}T00:00:00`) - new Date(`${firstEvent.date}T00:00:00`);
      }

      if (selectedSort === 'price-asc') {
        return getLowestTicketPrice(firstEvent) - getLowestTicketPrice(secondEvent);
      }

      if (selectedSort === 'price-desc') {
        return getLowestTicketPrice(secondEvent) - getLowestTicketPrice(firstEvent);
      }

      return 0;
    });

    return result;
  }, [events, deferredSearchQuery, selectedCategory, selectedDateRange, selectedPriceTier, selectedSort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDateRange('All');
    setSelectedPriceTier('All');
    setSelectedSort('date-asc');
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="page-hero">
          <h1 className="page-title">Discover Amazing Events</h1>
          <p className="page-subtitle">Fetching local events, hackathons, and concerts...</p>
        </div>
        <div className="events-grid" aria-label="Loading events">
          {[1, 2, 3].map((item) => (
            <article className="event-card skeleton-card" key={item}>
              <div className="skeleton skeleton-image"></div>
              <div className="event-card-content">
                <div className="skeleton skeleton-line short"></div>
                <div className="skeleton skeleton-line title"></div>
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton-row">
                  <div className="skeleton skeleton-line small"></div>
                  <div className="skeleton skeleton-pill"></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <div className="error-state">
          <div className="error-state-title">Data Fetching Failed</div>
          <p>{error.message || 'Something went wrong while loading events.'}</p>
          <button className="retry-button" onClick={() => refetch()}>Retry Fetching</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Page Title Header */}
      <div className="page-hero">
        <h1 className="page-title">Discover Amazing Events</h1>
        <p className="page-subtitle">Browse through available concerts, arts, sports, and tech events near you.</p>
      </div>

      {/* Search and Filters Section */}
      <section className="search-filter-section" aria-label="Search and filter events">
        {/* Title Search Input */}
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            ref={searchInputRef}
            className="search-input"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Select Dropdown row */}
        <div className="filters-grid">
          <div className="filter-group" style={{ gridColumn: 'span 1' }}>
            <label className="filter-label" htmlFor="cat-filter">Category</label>
            <select
              id="cat-filter"
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          <div className="filter-group" style={{ gridColumn: 'span 1' }}>
            <label className="filter-label" htmlFor="date-filter">Date Range</label>
            <select
              id="date-filter"
              className="filter-select"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <option value="All">All Dates</option>
              <option value="Upcoming">Upcoming</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <div className="filter-group" style={{ gridColumn: 'span 1' }}>
            <label className="filter-label" htmlFor="price-filter">Price Range</label>
            <select
              id="price-filter"
              className="filter-select"
              value={selectedPriceTier}
              onChange={(e) => setSelectedPriceTier(e.target.value)}
            >
              <option value="All">All Prices</option>
              <option value="Free">Free</option>
              <option value="Under $50">Under $50</option>
              <option value="$50+">$50+</option>
            </select>
          </div>

          <div className="filter-group" style={{ gridColumn: 'span 1' }}>
            <label className="filter-label" htmlFor="sort-select">Sort By</label>
            <select
              id="sort-select"
              className="filter-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="date-asc">Date: Soonest First</option>
              <option value="date-desc">Date: Latest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {(searchQuery || selectedCategory !== 'All' || selectedDateRange !== 'All' || selectedPriceTier !== 'All' || selectedSort !== 'date-asc') && (
          <div className="active-filters">
            <span className="result-count">
              Showing {filteredEvents.length} result(s)
            </span>
            <button className="reset-filters-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Grid listing events */}
      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">Search</span>
          <h3 className="empty-state-title">No events found</h3>
          <p className="empty-state-description">We couldn't find any events matching your selected search query, category, date, or price filters.</p>
          <button className="retry-button" onClick={handleResetFilters}>
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              isFavorite={favoriteEvents.includes(event.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
