import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { ReactElement } from 'react';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { Event, EventForm } from '../types';

// ! HINT. 이 유틸을 사용해 리액트 컴포넌트를 렌더링해보세요.
const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user }; // ? Medium: 여기서 ChakraProvider로 묶어주는 동작은 의미있을까요? 있다면 어떤 의미일까요?
};

// // ! HINT. 이 유틸을 사용해 일정을 저장해보세요.
const saveSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime' | 'repeat'>
) => {
  const { title, date, startTime, endTime, location, description, category } = form;

  await user.click(screen.getAllByText('일정 추가')[0]);

  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.selectOptions(screen.getByLabelText('카테고리'), category);

  await user.click(screen.getByTestId('event-submit-button'));
};

const initialEvents = [
  {
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
  },
] as Event[];

const newEvent = {
  title: '점심먹기',
  date: '2024-10-04',
  startTime: '10:00',
  endTime: '11:00',
  description: '점심시간',
  location: '김밥천국',
  category: '기타',
  notificationTime: 10,
  repeat: { type: 'daily', interval: 0, endDate: '2025-02-10' },
} as EventForm;

// ! HINT. "검색 결과가 없습니다"는 초기에 노출되는데요. 그럼 검증하고자 하는 액션이 실행되기 전에 검증해버리지 않을까요? 이 테스트를 신뢰성있게 만드려면 어떻게 할까요?
describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.

    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await waitFor(() => {
      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });

    await saveSchedule(user, newEvent);

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    setupMockHandlerUpdating();

    const { user } = setup(<App />);

    const eventList = screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText(initialEvents[0].title)).toBeInTheDocument();
    });

    const editButton = within(eventList).getAllByLabelText(/edit event/i);
    await user.click(editButton[0]);

    const titleInput = screen.getByLabelText('제목');

    await user.clear(titleInput);
    await user.type(titleInput, newEvent.title);

    await user.click(screen.getByTestId('event-submit-button'));

    expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion();

    const { user } = setup(<App />);

    const eventList = screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText('삭제할 이벤트')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByLabelText(/delete event/i);
    user.click(deleteButton[0]);

    await waitFor(() => {
      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    const { user } = setup(<App />);

    const viewSelect = screen.getByLabelText('view');

    await user.selectOptions(viewSelect, 'week');

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await waitFor(() => {
      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });

    await saveSchedule(user, newEvent);

    const viewSelect = screen.getByLabelText('view');

    await user.selectOptions(viewSelect, 'week');

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    const { user } = setup(<App />);

    const calendarNextButton = screen.getByLabelText('Next');

    await user.click(calendarNextButton);

    const viewSelect = screen.getByLabelText('view');

    await user.selectOptions(viewSelect, 'month');

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await waitFor(() => {
      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });

    await saveSchedule(user, newEvent);

    const viewSelect = screen.getByLabelText('view');

    await user.selectOptions(viewSelect, 'month');

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    const { user } = setup(<App />);

    const calendarPrevButton = screen.getByLabelText('Previous');

    await user.click(calendarPrevButton);
    await user.click(calendarPrevButton);
    await user.click(calendarPrevButton);
    await user.click(calendarPrevButton);
    await user.click(calendarPrevButton);
    await user.click(calendarPrevButton);
    await user.click(calendarPrevButton);
    await user.click(calendarPrevButton);
    await user.click(calendarPrevButton);

    const monthCalendar = screen.getByTestId('month-view');
    expect(within(monthCalendar).getByText('신정')).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  const events = [
    {
      title: '팀 회의',
      date: '2024-10-05',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      title: '점심시간',
      date: '2024-10-05',
      startTime: '13:00',
      endTime: '14:00',
      description: '점심',
      location: '김밥천국',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ] as Event[];

  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    const { user } = setup(<App />);

    const searchInput = screen.getByLabelText('일정 검색');

    await user.type(searchInput, '저녁 먹기');

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    setupMockHandlerCreation(events);

    const { user } = setup(<App />);

    const searchInput = screen.getByLabelText('일정 검색');
    await user.type(searchInput, '팀 회의');

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).queryByText('점심시간')).not.toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    setupMockHandlerCreation(events);

    const { user } = setup(<App />);

    const searchInput = screen.getByLabelText('일정 검색');
    await user.type(searchInput, '팀 회의');

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).queryByText('점심시간')).not.toBeInTheDocument();

    await user.clear(searchInput);

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).queryByText('점심시간')).toBeInTheDocument();
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await saveSchedule(user, newEvent);

    await saveSchedule(user, newEvent);

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    setupMockHandlerUpdating();

    const { user } = setup(<App />);

    const eventList = screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText('기존 회의')).toBeInTheDocument();
    });

    const editButton = within(eventList).getAllByLabelText(/edit event/i);
    await user.click(editButton[1]);

    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    await user.clear(startTimeInput);
    await user.clear(endTimeInput);

    await user.type(startTimeInput, '10:00');
    await user.type(endTimeInput, '09:00');

    await user.click(screen.getByTestId('event-submit-button'));

    const toastMessage = await screen.findAllByText(/시간 설정을 확인해주세요/i);
    expect(toastMessage[0]).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  setupMockHandlerCreation(initialEvents);

  vi.setSystemTime(new Date('2024-10-15T08:50'));

  const { user } = setup(<App />);

  const eventList = screen.getByTestId('event-list');

  await saveSchedule(user, newEvent);

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    expect(within(eventList).getByText('기존 회의')).toBeInTheDocument();
  });

  expect(screen.getByText('10분 전')).toBeInTheDocument();
});
