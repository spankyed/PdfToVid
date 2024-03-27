import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { socket } from './fetch';
import { calendarModelAtom } from '~/calendar/components/main/store';

const SocketListener = () => {
  const setCalendarModel = useSetAtom(calendarModelAtom);

  useEffect(() => {
    const socketHandlers = { 
      date_status: (status) => {
        const { key, status: current, data } = status;
        setCalendarModel((oldCalendarModel) => {
          const index = oldCalendarModel.findIndex(({ date }) => date.value === key);
          
          if (index === -1) {
            console.error("Date not found", key);
            return oldCalendarModel;
          }
    
          const newCalendarModel = [...oldCalendarModel];
          newCalendarModel[index].date.status = current;
          if (current === 'complete') {
            newCalendarModel[index].papers = data;
          }
    
          return newCalendarModel;
        });
      },
    };

    Object.keys(socketHandlers).forEach((event) => {
      socket.on(event, socketHandlers[event]);
    });

    return () => {
    // Cleanup function
      Object.keys(socketHandlers).forEach((event) => {
        socket.off(event, socketHandlers[event]);
      });
    };
  }, [setCalendarModel]);

  return null; // Non-visual component, so it returns null
};

export default SocketListener;
