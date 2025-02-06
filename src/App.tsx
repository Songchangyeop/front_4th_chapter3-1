import { Box, Flex, Heading, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { CalendarControl } from './components/CalendarControl.tsx';
import { EventForm } from './components/EventForm.tsx';
import EventList from './components/EventList.tsx';
import { EventOverlapWarningDialog } from './components/EventOverlapWarningDialog.tsx';
import { MonthCalendar } from './components/MonthCalendar.tsx';
import { Notifications } from './components/Notifications.tsx';
import { WeekCalendar } from './components/WeekCalendar.tsx';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event } from './types';

function App() {
  const { events } = useEventOperations();

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, navigate, holidays } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const addOverlappingEvents = (events: Event[]) => {
    setOverlappingEvents(events);
  };

  const toggleDialog = () => {
    setIsOverlapDialogOpen((prev) => !prev);
  };

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        {/* 이벤트 폼 */}
        <EventForm addOverlappingEvents={addOverlappingEvents} toggleDialog={toggleDialog} />

        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>

          {/* 달력 날짜 컨트롤 */}
          <CalendarControl navigate={navigate} view={view} setView={setView} />

          {view === 'week' && (
            <WeekCalendar
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
              currentDate={currentDate}
            />
          )}
          {view === 'month' && (
            <MonthCalendar
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
              currentDate={currentDate}
              holidays={holidays}
            />
          )}
        </VStack>

        {/* 이벤트 리스트 */}
        <EventList
          currentDate={currentDate}
          searchTerm={searchTerm}
          filteredEvents={filteredEvents}
          setSearchTerm={setSearchTerm}
          notifiedEvents={notifiedEvents}
        />
      </Flex>

      {/* 일정 중복 경고 Dialog */}
      <EventOverlapWarningDialog
        isOpen={isOverlapDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={toggleDialog}
        overlappingEvents={overlappingEvents}
      />

      {/* 알림 */}
      {notifications.length > 0 && (
        <Notifications notifications={notifications} setNotifications={setNotifications} />
      )}
    </Box>
  );
}

export default App;
