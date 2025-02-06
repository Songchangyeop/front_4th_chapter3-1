import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, HStack, IconButton, Select, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';

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
        <EventForm addOverlappingEvents={addOverlappingEvents} toggleDialog={toggleDialog} />

        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>

          <HStack mx="auto" justifyContent="space-between">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              onClick={() => navigate('prev')}
            />
            <Select
              aria-label="view"
              value={view}
              onChange={(e) => setView(e.target.value as 'week' | 'month')}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              onClick={() => navigate('next')}
            />
          </HStack>

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

        <EventList
          currentDate={currentDate}
          searchTerm={searchTerm}
          filteredEvents={filteredEvents}
          setSearchTerm={setSearchTerm}
          notifiedEvents={notifiedEvents}
        />
      </Flex>

      <EventOverlapWarningDialog
        isOpen={isOverlapDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={toggleDialog}
        overlappingEvents={overlappingEvents}
      />

      {notifications.length > 0 && (
        <Notifications notifications={notifications} setNotifications={setNotifications} />
      )}
    </Box>
  );
}

export default App;
