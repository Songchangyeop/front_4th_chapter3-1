import { Button, useToast } from '@chakra-ui/react';

import { useEventOperations } from '../hooks/useEventOperations';
import { useEventFormStore } from '../store/eventFormStore';
import { Event, EventForm } from '../types';
import { findOverlappingEvents } from '../utils/eventOverlap';

interface EventSubmitButtonProps {
  toggleDialog: () => void;
  addOverlappingEvents: (events: Event[]) => void;
}

export const EventSubmitButton = ({
  toggleDialog,
  addOverlappingEvents,
}: EventSubmitButtonProps) => {
  const toast = useToast();

  const { events, saveEvent } = useEventOperations();

  const {
    title,
    date,
    startTimeError,
    startTime,
    endTime,
    editingEvent,
    endTimeError,
    description,
    location,
    category,
    isRepeating,
    notificationTime,
    repeatType,
    repeatInterval,
    repeatEndDate,
    resetForm,
  } = useEventFormStore();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (startTimeError || endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      addOverlappingEvents(overlapping);
      toggleDialog();
    } else {
      await saveEvent(eventData);
      resetForm();
    }
  };

  return (
    <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
      {editingEvent ? '일정 수정' : '일정 추가'}
    </Button>
  );
};
