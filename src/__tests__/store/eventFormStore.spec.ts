import { act } from '@testing-library/react';
import React from 'react';

import { useEventFormStore } from '../../store/eventFormStore';
import { Event } from '../../types';

const newEvent = {
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

describe('useEventFormStore', () => {
  beforeEach(() => {
    useEventFormStore.setState({
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
    });
  });

  it('기본 Form 필드에 입력한 값을 변경할 수 있다', () => {
    const store = useEventFormStore.getState();

    act(() => {
      store.setTitle('점심 먹기');
      store.setDate('2024-10-01');
      store.setDescription('점심 약속');
      store.setLocation('김밥천국');
      store.setCategory('식사');
    });

    const newState = useEventFormStore.getState();
    expect(newState.title).toBe('점심 먹기');
    expect(newState.date).toBe('2024-10-01');
    expect(newState.description).toBe('점심 약속');
    expect(newState.location).toBe('김밥천국');
    expect(newState.category).toBe('식사');
  });

  it('handleStartTimeChange와 handleEndTimeChange을 호출하여 시간을 변경하고 유효성을 검사한다.', () => {
    const newStartTime = { target: { value: '10:00' } } as React.ChangeEvent<HTMLInputElement>;
    const newEndTime = { target: { value: '09:00' } } as React.ChangeEvent<HTMLInputElement>;
    const store = useEventFormStore.getState();

    store.handleStartTimeChange(newStartTime);
    store.handleEndTimeChange(newEndTime);

    const state = useEventFormStore.getState();

    expect(state.startTime).toBe('10:00');
    expect(state.endTime).toBe('09:00');
    expect(state.endTimeError).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
  });

  it('폼을 초기 상태로 리셋할 수 있다.', () => {
    const store = useEventFormStore.getState();

    store.setTitle('점심 먹기');
    store.setDate('2024-10-01');
    store.setDescription('점심 약속');
    store.resetForm();

    const state = useEventFormStore.getState();
    expect(state.title).toBe('');
    expect(state.date).toBe('');
    expect(state.description).toBe('');
  });

  it('이벤트의 모든 필드를 수정할 수 있다', () => {
    const store = useEventFormStore.getState();

    store.editEvent(newEvent);

    const state = useEventFormStore.getState();
    expect(state.title).toBe(newEvent.title);
    expect(state.date).toBe(newEvent.date);
    expect(state.description).toBe(newEvent.description);
  });
});
