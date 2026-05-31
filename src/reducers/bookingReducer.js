export const initialBookingState = {
  quantities: {},
};

export const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TICKET_QUANTITY':
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.ticketId]: action.quantity,
        },
      };
    case 'RESET_BOOKING':
      return initialBookingState;
    default:
      return state;
  }
};
