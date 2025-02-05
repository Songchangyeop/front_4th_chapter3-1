import { act, renderHook, waitFor } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';
import { createNotificationMessage } from '../../utils/notificationUtils.ts';

const initialEvents: Event[] = [
  {
    id: '1',
    title: '점심먹기',
    date: '2025-02-06',
    startTime: '13:00',
    endTime: '14:00',
    description: '점심시간',
    location: '김밥천국',
    category: '점심',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('useNotifications', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2025-02-06T12:50'));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('초기 상태에서는 알림이 없어야 한다', () => {
    const { result } = renderHook(() => useNotifications(initialEvents));

    expect(result.current.notifications).toEqual([]);
  });

  it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
    const { result } = renderHook(() => useNotifications(initialEvents));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    waitFor(() => {
      expect(result.current.notifications).toEqual([
        {
          id: '1',
          message: '10분 후 점심먹기 일정이 시작됩니다.',
        },
      ]);
    });
  });

  it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
    const { result } = renderHook(() => useNotifications(initialEvents));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.removeNotification(0);
    });

    waitFor(() => {
      expect(result.current.notifications).toEqual([]);
    });
  });

  it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
    const { result } = renderHook(() => useNotifications(initialEvents));

    const notification = createNotificationMessage(initialEvents[0]);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    waitFor(() => {
      expect(result.current.notifications).toEqual([
        {
          id: '1',
          message: notification,
        },
      ]);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    waitFor(() => {
      expect(result.current.notifications).toEqual([
        {
          id: '1',
          message: notification,
        },
      ]);
    });
  });
});
