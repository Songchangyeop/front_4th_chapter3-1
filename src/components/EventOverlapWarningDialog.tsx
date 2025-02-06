import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import { useEventOperations } from '../hooks/useEventOperations';
import { useEventFormStore } from '../store/eventFormStore';
import { Event } from '../types';

interface EventOverlapWarningDialogProps extends Omit<AlertDialogProps, 'children'> {
  overlappingEvents: Event[];
}

export const EventOverlapWarningDialog = ({
  isOpen,
  leastDestructiveRef,
  onClose,
  overlappingEvents,
}: EventOverlapWarningDialogProps) => {
  const { saveEvent } = useEventOperations();

  const {
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    isRepeating,
    repeatType,
    repeatInterval,
    repeatEndDate,
    notificationTime,
    editingEvent,
  } = useEventFormStore();

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={leastDestructiveRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            다음 일정과 겹칩니다:
            {overlappingEvents.map((event) => (
              <Text key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Text>
            ))}
            계속 진행하시겠습니까?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={leastDestructiveRef as React.RefObject<HTMLButtonElement>}
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onClose();
                saveEvent({
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
                });
              }}
              ml={3}
            >
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
