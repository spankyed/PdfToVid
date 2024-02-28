
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { papersListAtom } from '.';
import { socket } from '../api';

// io.emit('status', { type, key, status, data, final });

export const useSetupSocketListeners = () => {
  const setPapersList = useSetAtom(papersListAtom);

  useEffect(() => {
    const socketHandlers = {
      day_status: () => (status, date) => {
        const { key, status: current, data } = status;
        setPapersList((oldPapersList) => {
          const index = oldPapersList.findIndex(({ day }) => day.value === key);
          if (index === -1) {
            console.error("Day not found", key);
            return oldPapersList;
          }
    
          const newPapersList = [...oldPapersList];
          newPapersList[index].day.status = current;
          if (current === 'complete') {
            newPapersList[index].papers = data;
          }
    
          return newPapersList;
        });
      },
    };

    Object.keys(socketHandlers).forEach((event) => {
      socket.on(event, (...args) => socketHandlers[event](...args));
    });

    // Cleanup
    return () => {
      Object.keys(socketHandlers).forEach((event) => {
        socket.off(event);
      });
    };
  }, [setPapersList]);
};