import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { socket } from './fetch';
import { calendarModelAtomBase } from '~/calendar/store';

const SocketListener = () => {
  const setCalendarModelBase = useSetAtom(calendarModelAtomBase);

  useEffect(() => {
    const handleDateStatusUpdate = ({ key, status: newStatus, data }) => {
      setCalendarModelBase((prevModel) => {
        const updatedModel = prevModel.map((item) => {
          if (item.date.value === key) {
            return {
              ...item,
              date: { ...item.date, status: newStatus },
              papers: newStatus === 'complete' ? data : item.papers,
            };
          }
          return item;
        });
        return updatedModel;
      });
    };

    socket.on('date_status', handleDateStatusUpdate);

    return () => {
      socket.off('date_status', handleDateStatusUpdate);
    };
  }, [setCalendarModelBase]);

  return null;
};

export default SocketListener;
