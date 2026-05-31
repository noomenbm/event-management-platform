export const initialBookingState = {
  step: 1,
  quantities: {},
  attendees: [],
};

const buildAttendees = (count, currentAttendees) =>
  Array.from({ length: count }, (_, index) => (
    currentAttendees[index] || { name: '', email: '', phone: '' }
  ));

export const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TICKET_QUANTITY': {
      const quantities = {
        ...state.quantities,
        [action.ticketId]: action.quantity,
      };
      const totalTickets = Object.values(quantities).reduce((total, quantity) => total + quantity, 0);

      return {
        ...state,
        quantities,
        attendees: buildAttendees(totalTickets, state.attendees),
      };
    }
    case 'SET_STEP':
      return {
        ...state,
        step: action.step,
      };
    case 'UPDATE_ATTENDEE':
      return {
        ...state,
        attendees: state.attendees.map((attendee, index) => {
          if (index !== action.index) return attendee;

          return {
            ...attendee,
            [action.field]: action.value,
          };
        }),
      };
    case 'RESET_BOOKING':
      return initialBookingState;
    default:
      return state;
  }
};
