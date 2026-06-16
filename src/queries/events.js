import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const eventKeys = {
  all: ['events'],
  lists: () => [...eventKeys.all, 'list'],
  list: (queryParams = {}) => [...eventKeys.lists(), queryParams],
  details: () => [...eventKeys.all, 'detail'],
  detail: (eventId) => [...eventKeys.details(), eventId],
};

export const useEventsQuery = (queryParams = {}) => (
  useQuery({
    queryKey: eventKeys.list(queryParams),
    queryFn: () => api.getEvents(queryParams),
  })
);

export const useEventQuery = (eventId) => (
  useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => api.getEventById(eventId),
    enabled: Boolean(eventId),
  })
);
