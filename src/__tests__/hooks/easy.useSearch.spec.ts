import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const events: Event[] = [
  {
    id: '1',
    title: '기존 회의',
    date: '2024-07-14',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 먹기',
    date: '2024-07-01',
    startTime: '10:00',
    endTime: '12:00',
    description: '점심시간',
    location: '김밥천국',
    category: '점심밥',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('');
  });

  expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'week'));

  act(() => {
    result.current.setSearchTerm('점심 먹기');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0]).toEqual(events[1]);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'week'));

  act(() => {
    result.current.setSearchTerm('점심 먹기');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0]).toEqual(events[1]);

  act(() => {
    result.current.setSearchTerm('점심시간');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0]).toEqual(events[1]);

  act(() => {
    result.current.setSearchTerm('김밥천국');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0]).toEqual(events[1]);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result: monthResult } = renderHook(() =>
    useSearch(events, new Date('2024-07-01'), 'month')
  );

  expect(monthResult.current.filteredEvents).toHaveLength(2);

  const { result: weekResult } = renderHook(() =>
    useSearch(events, new Date('2024-07-14'), 'week')
  );

  expect(weekResult.current.filteredEvents).toHaveLength(1);
  expect(weekResult.current.filteredEvents[0]).toEqual(events[0]);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents[0]).toEqual(events[0]);

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents[0]).toEqual(events[1]);
});
