import { act } from '@testing-library/react';

import { useEventsStore } from '../../store/eventsStore';
import { Event } from '../../types';

describe.only('useEventsStore', () => {
  const newEvent = {
    id: '1',
    title: '기존 회의',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  } as Event;

  it('초기 상태는 빈 배열이어야 한다.', () => {
    const { events } = useEventsStore.getState();
    expect(events).toEqual([]);
  });

  it('setEvents를 호출하면 상태가 변경되어야 한다.', () => {
    const mockEvents = [newEvent];

    act(() => {
      useEventsStore.getState().setEvents(mockEvents);
    });

    expect(useEventsStore.getState().events).toEqual(mockEvents);
  });
});
