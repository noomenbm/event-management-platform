import { createSlice } from '@reduxjs/toolkit';

const emptyTicketType = () => ({
  id: crypto.randomUUID(),
  name: '',
  price: 0,
  available: 1,
});

const createInitialState = () => ({
  step: 1,
  basicInfo: {
    title: '',
    description: '',
    category: 'Technology',
    image: '',
  },
  schedule: {
    date: '',
    time: '',
    location: '',
    venue: '',
  },
  ticketTypes: [emptyTicketType()],
  errors: {},
});

const initialState = createInitialState();

const sanitizeDraft = (draft) => ({
  ...createInitialState(),
  ...draft,
  basicInfo: {
    ...createInitialState().basicInfo,
    ...draft.basicInfo,
  },
  schedule: {
    ...createInitialState().schedule,
    ...draft.schedule,
  },
  ticketTypes: draft.ticketTypes?.length ? draft.ticketTypes : [emptyTicketType()],
  errors: {},
});

const validateBasicInfo = (basicInfo) => {
  const errors = {};

  if (!basicInfo.title.trim()) errors.title = 'Title is required.';
  if (!basicInfo.description.trim()) errors.description = 'Description is required.';
  if (!basicInfo.category) errors.category = 'Category is required.';
  if (!basicInfo.image.trim()) errors.image = 'Image URL is required.';

  return errors;
};

const validateSchedule = (schedule, ticketTypes) => {
  const errors = {};

  if (!schedule.date) errors.date = 'Date is required.';
  if (!schedule.time.trim()) errors.time = 'Time is required.';
  if (!schedule.location.trim()) errors.location = 'Location is required.';
  if (!schedule.venue.trim()) errors.venue = 'Venue is required.';

  ticketTypes.forEach((ticket, index) => {
    if (!ticket.name.trim()) errors[`ticket-${index}-name`] = 'Ticket name is required.';
    if (Number(ticket.price) < 0) errors[`ticket-${index}-price`] = 'Price cannot be negative.';
    if (Number(ticket.available) < 1) errors[`ticket-${index}-available`] = 'At least one ticket must be available.';
  });

  return errors;
};

export const getCreateEventStepErrors = (state, step = state.step) => {
  if (step === 1) return validateBasicInfo(state.basicInfo);
  if (step === 2) return validateSchedule(state.schedule, state.ticketTypes);
  return {
    ...validateBasicInfo(state.basicInfo),
    ...validateSchedule(state.schedule, state.ticketTypes),
  };
};

export const createEventSlice = createSlice({
  name: 'createEvent',
  initialState,
  reducers: {
    updateBasicInfo: (state, action) => {
      state.basicInfo[action.payload.field] = action.payload.value;
      delete state.errors[action.payload.field];
    },
    updateSchedule: (state, action) => {
      state.schedule[action.payload.field] = action.payload.value;
      delete state.errors[action.payload.field];
    },
    addTicketType: (state) => {
      state.ticketTypes.push(emptyTicketType());
    },
    removeTicketType: (state, action) => {
      if (state.ticketTypes.length === 1) return;
      state.ticketTypes.splice(action.payload, 1);
    },
    updateTicketType: (state, action) => {
      const { index, field, value } = action.payload;
      state.ticketTypes[index][field] = field === 'name' ? value : Number(value);
      delete state.errors[`ticket-${index}-${field}`];
    },
    goToStep: (state, action) => {
      state.step = action.payload;
    },
    validateCurrentStep: (state) => {
      state.errors = getCreateEventStepErrors(state);
    },
    validateAllSteps: (state) => {
      state.errors = getCreateEventStepErrors(state, 3);
    },
    loadCreateEventDraft: (_state, action) => sanitizeDraft(action.payload),
    resetCreateEvent: () => createInitialState(),
  },
});

export const {
  addTicketType,
  goToStep,
  loadCreateEventDraft,
  removeTicketType,
  resetCreateEvent,
  updateBasicInfo,
  updateSchedule,
  updateTicketType,
  validateAllSteps,
  validateCurrentStep,
} = createEventSlice.actions;

export const selectCreateEvent = (state) => state.createEvent;
export const selectCreateEventStepErrors = (state, step = state.createEvent.step) => (
  getCreateEventStepErrors(state.createEvent, step)
);

export default createEventSlice.reducer;
