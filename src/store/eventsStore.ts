import { create } from 'zustand';

import { Event } from '../types';

interface EventsStore {
  events: Event[];
  setEvents: (events: Event[]) => void;
}

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
}));
