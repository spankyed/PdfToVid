import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { socket } from './fetch';
import { calenderModelAtom } from '~/calender/components/main/store';

const SocketListener = () => {
  const setCalenderModel = useSetAtom(calenderModelAtom);

  useEffect(() => {
    const socketHandlers = { 
      day_status: (status) => {
        const { key, status: current, data } = status;
        setCalenderModel((oldCalenderModel) => {
          const index = oldCalenderModel.findIndex(({ date }) => date.value === key);
          
          if (index === -1) {
            console.error("Day not found", key);
            return oldCalenderModel;
          }
    
          const newCalenderModel = [...oldCalenderModel];
          newCalenderModel[index].date.status = current;
          if (current === 'complete') {
            newCalenderModel[index].papers = data;
          }
    
          return newCalenderModel;
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
  }, [setCalenderModel]);

  return null; // Non-visual component, so it returns null
};

export default SocketListener;
