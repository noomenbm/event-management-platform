import { useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useCreateEventMutation } from '../queries/events';
import {
  addTicketType,
  getCreateEventStepErrors,
  goToStep,
  removeTicketType,
  resetCreateEvent,
  selectCreateEvent,
  updateBasicInfo,
  updateSchedule,
  updateTicketType,
  validateAllSteps,
  validateCurrentStep,
} from '../store/createEventSlice';

const categories = ['Technology', 'Music', 'Sports', 'Arts'];

const buildEventPayload = (wizard) => ({
  id: crypto.randomUUID(),
  title: wizard.basicInfo.title.trim(),
  description: wizard.basicInfo.description.trim(),
  category: wizard.basicInfo.category,
  date: wizard.schedule.date,
  time: wizard.schedule.time.trim(),
  location: wizard.schedule.location.trim(),
  venue: wizard.schedule.venue.trim(),
  image: wizard.basicInfo.image.trim(),
  organizerName: 'VibeVent Organizer',
  ticketTypes: wizard.ticketTypes.map((ticket) => ({
    id: ticket.id,
    name: ticket.name.trim(),
    price: Number(ticket.price),
    available: Number(ticket.available),
  })),
});

export const CreateEventPage = () => {
  const formId = useId();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useOutletContext();
  const wizard = useSelector(selectCreateEvent);
  const createEventMutation = useCreateEventMutation();

  const currentStepErrors = getCreateEventStepErrors(wizard);

  const handleNext = () => {
    const errors = getCreateEventStepErrors(wizard);
    dispatch(validateCurrentStep());

    if (Object.keys(errors).length === 0) {
      dispatch(goToStep(wizard.step + 1));
    }
  };

  const handlePublish = async () => {
    const errors = getCreateEventStepErrors(wizard, 3);
    dispatch(validateAllSteps());

    if (Object.keys(errors).length > 0) return;

    try {
      const createdEvent = await createEventMutation.mutateAsync(buildEventPayload(wizard));
      dispatch(resetCreateEvent());
      showToast('Event published successfully.');
      navigate(`/events/${createdEvent.id}`);
    } catch {
      showToast('Unable to publish event.', 'error');
    }
  };

  return (
    <div className="container">
      <div className="page-hero">
        <h1 className="page-title">Create Event</h1>
        <p className="page-subtitle">Build and publish a new event listing.</p>
      </div>

      <section className="create-event-layout" aria-labelledby="create-event-step-title">
        <aside className="create-event-steps" aria-label="Create event progress">
          {[1, 2, 3].map((step) => (
            <button
              className={wizard.step === step ? 'active' : ''}
              key={step}
              type="button"
              onClick={() => dispatch(goToStep(step))}
            >
              Step {step}
            </button>
          ))}
        </aside>

        <div className="create-event-panel">
          {wizard.step === 1 && (
            <>
              <h2 id="create-event-step-title">Basic Info</h2>
              <label className="profile-field" htmlFor={`${formId}-title`}>
                Title
                <input
                  id={`${formId}-title`}
                  className="profile-input"
                  type="text"
                  value={wizard.basicInfo.title}
                  onChange={(event) => dispatch(updateBasicInfo({ field: 'title', value: event.target.value }))}
                />
                {wizard.errors.title && <span className="input-error">{wizard.errors.title}</span>}
              </label>
              <label className="profile-field" htmlFor={`${formId}-description`}>
                Description
                <textarea
                  id={`${formId}-description`}
                  className="profile-input"
                  rows="5"
                  value={wizard.basicInfo.description}
                  onChange={(event) => dispatch(updateBasicInfo({ field: 'description', value: event.target.value }))}
                />
                {wizard.errors.description && <span className="input-error">{wizard.errors.description}</span>}
              </label>
              <label className="profile-field" htmlFor={`${formId}-category`}>
                Category
                <select
                  id={`${formId}-category`}
                  className="filter-select"
                  value={wizard.basicInfo.category}
                  onChange={(event) => dispatch(updateBasicInfo({ field: 'category', value: event.target.value }))}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {wizard.errors.category && <span className="input-error">{wizard.errors.category}</span>}
              </label>
              <label className="profile-field" htmlFor={`${formId}-image`}>
                Image URL
                <input
                  id={`${formId}-image`}
                  className="profile-input"
                  type="url"
                  value={wizard.basicInfo.image}
                  onChange={(event) => dispatch(updateBasicInfo({ field: 'image', value: event.target.value }))}
                />
                {wizard.errors.image && <span className="input-error">{wizard.errors.image}</span>}
              </label>
            </>
          )}

          {wizard.step === 2 && (
            <>
              <h2 id="create-event-step-title">Schedule and Tickets</h2>
              <div className="create-event-grid">
                <label className="profile-field" htmlFor={`${formId}-date`}>
                  Date
                  <input
                    id={`${formId}-date`}
                    className="profile-input"
                    type="date"
                    value={wizard.schedule.date}
                    onChange={(event) => dispatch(updateSchedule({ field: 'date', value: event.target.value }))}
                  />
                  {wizard.errors.date && <span className="input-error">{wizard.errors.date}</span>}
                </label>
                <label className="profile-field" htmlFor={`${formId}-time`}>
                  Time
                  <input
                    id={`${formId}-time`}
                    className="profile-input"
                    type="text"
                    placeholder="09:00 AM"
                    value={wizard.schedule.time}
                    onChange={(event) => dispatch(updateSchedule({ field: 'time', value: event.target.value }))}
                  />
                  {wizard.errors.time && <span className="input-error">{wizard.errors.time}</span>}
                </label>
              </div>
              <label className="profile-field" htmlFor={`${formId}-location`}>
                Location
                <input
                  id={`${formId}-location`}
                  className="profile-input"
                  type="text"
                  value={wizard.schedule.location}
                  onChange={(event) => dispatch(updateSchedule({ field: 'location', value: event.target.value }))}
                />
                {wizard.errors.location && <span className="input-error">{wizard.errors.location}</span>}
              </label>
              <label className="profile-field" htmlFor={`${formId}-venue`}>
                Venue
                <input
                  id={`${formId}-venue`}
                  className="profile-input"
                  type="text"
                  value={wizard.schedule.venue}
                  onChange={(event) => dispatch(updateSchedule({ field: 'venue', value: event.target.value }))}
                />
                {wizard.errors.venue && <span className="input-error">{wizard.errors.venue}</span>}
              </label>

              <div className="ticket-editor-heading">
                <h3>Ticket Types</h3>
                <button className="secondary-button" type="button" onClick={() => dispatch(addTicketType())}>
                  Add Ticket
                </button>
              </div>
              <div className="ticket-editor-list">
                {wizard.ticketTypes.map((ticket, index) => (
                  <div className="ticket-editor-row" key={ticket.id}>
                    <label className="profile-field" htmlFor={`${formId}-ticket-${index}-name`}>
                      Name
                      <input
                        id={`${formId}-ticket-${index}-name`}
                        className="profile-input"
                        type="text"
                        value={ticket.name}
                        onChange={(event) => dispatch(updateTicketType({ index, field: 'name', value: event.target.value }))}
                      />
                      {wizard.errors[`ticket-${index}-name`] && <span className="input-error">{wizard.errors[`ticket-${index}-name`]}</span>}
                    </label>
                    <label className="profile-field" htmlFor={`${formId}-ticket-${index}-price`}>
                      Price
                      <input
                        id={`${formId}-ticket-${index}-price`}
                        className="profile-input"
                        type="number"
                        min="0"
                        value={ticket.price}
                        onChange={(event) => dispatch(updateTicketType({ index, field: 'price', value: event.target.value }))}
                      />
                      {wizard.errors[`ticket-${index}-price`] && <span className="input-error">{wizard.errors[`ticket-${index}-price`]}</span>}
                    </label>
                    <label className="profile-field" htmlFor={`${formId}-ticket-${index}-available`}>
                      Available
                      <input
                        id={`${formId}-ticket-${index}-available`}
                        className="profile-input"
                        type="number"
                        min="1"
                        value={ticket.available}
                        onChange={(event) => dispatch(updateTicketType({ index, field: 'available', value: event.target.value }))}
                      />
                      {wizard.errors[`ticket-${index}-available`] && <span className="input-error">{wizard.errors[`ticket-${index}-available`]}</span>}
                    </label>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => dispatch(removeTicketType(index))}
                      disabled={wizard.ticketTypes.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {wizard.step === 3 && (
            <>
              <h2 id="create-event-step-title">Preview and Publish</h2>
              {Object.keys(currentStepErrors).length > 0 && (
                <p className="input-error">Please complete the required fields before publishing.</p>
              )}
              <article className="create-event-preview">
                {wizard.basicInfo.image && <img src={wizard.basicInfo.image} alt="" />}
                <span>{wizard.basicInfo.category}</span>
                <h3>{wizard.basicInfo.title || 'Untitled event'}</h3>
                <p>{wizard.basicInfo.description || 'No description yet.'}</p>
                <dl className="profile-list">
                  <div>
                    <dt>Date and Time</dt>
                    <dd>{wizard.schedule.date || 'No date'} at {wizard.schedule.time || 'No time'}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{wizard.schedule.venue || 'No venue'}, {wizard.schedule.location || 'No location'}</dd>
                  </div>
                  <div>
                    <dt>Tickets</dt>
                    <dd>{wizard.ticketTypes.length} type(s)</dd>
                  </div>
                </dl>
              </article>
            </>
          )}

          <div className="booking-action-row create-event-actions">
            {wizard.step > 1 && (
              <button className="secondary-button" type="button" onClick={() => dispatch(goToStep(wizard.step - 1))}>
                Back
              </button>
            )}
            {wizard.step < 3 ? (
              <button className="primary-button" type="button" onClick={handleNext}>
                Continue
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={handlePublish} disabled={createEventMutation.isPending}>
                {createEventMutation.isPending ? 'Publishing...' : 'Publish Event'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
