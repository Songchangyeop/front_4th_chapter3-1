import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

const events: Event[] = [
  {
    id: '1',
    title: '기존 회의',
    date: '2024-07-04',
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
    title: '이전 회의',
    date: '2024-07-01',
    startTime: '10:00',
    endTime: '12:00',
    description: '기존 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('getFilteredEvents', () => {
  it("검색어 '기존 회의'에 맞는 이벤트만 반환한다", () => {
    const filteredEvent = getFilteredEvents(events, '기존 회의', new Date('2024-07-04'), 'week');

    expect(filteredEvent).toHaveLength(1);

    expect(filteredEvent[0].title).toBe('기존 회의');
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const filteredEvent = getFilteredEvents(events, '이전 회의', new Date('2024-07-01'), 'week');

    expect(filteredEvent).toHaveLength(1);

    expect(filteredEvent[0].date).toBe('2024-07-01');
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const filteredEvent = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');

    expect(filteredEvent).toHaveLength(2);
  });

  it("검색어 '기존 회의'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const filteredEvent = getFilteredEvents(events, '기존 회의', new Date('2024-07-04'), 'week');

    expect(filteredEvent).toHaveLength(1);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const filteredEvent = getFilteredEvents(events, '', new Date('2024-07-04'), 'week');

    expect(filteredEvent).toEqual(events);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const filteredEvent = getFilteredEvents(events, '회의실 a', new Date('2024-07-01'), 'week');

    expect(filteredEvent).toHaveLength(1);

    expect(filteredEvent[0].location).toBe('회의실 A');
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const filteredEvent = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');

    expect(filteredEvent).toHaveLength(2);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const filteredEvent = getFilteredEvents([], '', new Date('2024-07-01'), 'month');

    expect(filteredEvent).toHaveLength(0);
  });
});
