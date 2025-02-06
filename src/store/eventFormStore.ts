import { ChangeEvent } from 'react';
import { create } from 'zustand';

import { Event, RepeatType } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';

interface EventFormState {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  isRepeating: boolean;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  notificationTime: number;
  editingEvent: Event | null;
  startTimeError: string | null;
  endTimeError: string | null;
}

interface EventFormActions {
  setTitle: (title: string) => void;
  setDate: (date: string) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setDescription: (desc: string) => void;
  setLocation: (location: string) => void;
  setCategory: (category: string) => void;
  setIsRepeating: (isRepeating: boolean) => void;
  setRepeatType: (type: RepeatType) => void;
  setRepeatInterval: (interval: number) => void;
  setRepeatEndDate: (date: string) => void;
  setNotificationTime: (time: number) => void;
  setEditingEvent: (event: Event | null) => void;
  handleStartTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  editEvent: (event: Event) => void;
}

const initialState: EventFormState = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '',
  isRepeating: false,
  repeatType: 'none',
  repeatInterval: 1,
  repeatEndDate: '',
  notificationTime: 10,
  editingEvent: null,
  startTimeError: null,
  endTimeError: null,
};

export const useEventFormStore = create<EventFormState & EventFormActions>((set) => ({
  ...initialState,

  setTitle: (title) => set({ title }),
  setDate: (date) => set({ date }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  setDescription: (description) => set({ description }),
  setLocation: (location) => set({ location }),
  setCategory: (category) => set({ category }),
  setIsRepeating: (isRepeating) => set({ isRepeating }),
  setRepeatType: (repeatType) => set({ repeatType }),
  setRepeatInterval: (repeatInterval) => set({ repeatInterval }),
  setRepeatEndDate: (repeatEndDate) => set({ repeatEndDate }),
  setNotificationTime: (notificationTime) => set({ notificationTime }),
  setEditingEvent: (editingEvent) => set({ editingEvent }),

  handleStartTimeChange: (e) => {
    const newStartTime = e.target.value;
    set((state) => ({
      startTime: newStartTime,
      ...getTimeErrorMessage(newStartTime, state.endTime),
    }));
  },

  handleEndTimeChange: (e) => {
    const newEndTime = e.target.value;
    set((state) => ({
      endTime: newEndTime,
      ...getTimeErrorMessage(state.startTime, newEndTime),
    }));
  },

  resetForm: () => set(initialState),

  editEvent: (event) =>
    set({
      editingEvent: event,
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      location: event.location,
      category: event.category,
      isRepeating: event.repeat.type !== 'none',
      repeatType: event.repeat.type,
      repeatInterval: event.repeat.interval,
      repeatEndDate: event.repeat.endDate || '',
      notificationTime: event.notificationTime,
    }),
}));
