const API_URL = '/api';

const request = async (path, options = {}) => {
  const config = { ...options };

  if (config.body) {
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  const response = await fetch(`${API_URL}${path}`, config);

  if (!response.ok) {
    throw new Error('API request failed. Make sure JSON Server is running.');
  }

  return response.json();
};

export const api = {
  // GET /events
  getEvents: async (queryParams = {}) => {
    const params = new URLSearchParams(queryParams).toString();
    return request(`/events${params ? `?${params}` : ''}`);
  },

  // GET /events/:id
  getEventById: async (id) => {
    return request(`/events/${id}`);
  },

  // POST /events
  createEvent: async (event) => {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  // GET /bookings?userId=user1
  getBookings: async (userId = 'user1') => {
    return request(`/bookings?userId=${userId}`);
  },

  // POST /bookings
  createBooking: async (booking) => {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },

  // PATCH /bookings/:id
  cancelBooking: async (id) => {
    return request(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    });
  },

  // GET /users/:id
  getUser: async (id = 'user1') => {
    return request(`/users/${id}`);
  },

  // PATCH /users/:id
  updateUser: async (id, updates) => {
    return request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
};
