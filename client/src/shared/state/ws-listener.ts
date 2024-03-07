import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { papersListAtom } from '.';
import { socket } from '../utils/api';

const SocketListener = () => {
  const setPapersList = useSetAtom(papersListAtom);

  useEffect(() => {
    const socketHandlers = {
      day_status: (status) => {
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

    // Setup socket event listeners
    Object.keys(socketHandlers).forEach((event) => {
      socket.on(event, socketHandlers[event]);
    });

    // Cleanup function
    return () => {
      Object.keys(socketHandlers).forEach((event) => {
        socket.off(event, socketHandlers[event]);
      });
    };
  }, [setPapersList]);

  return null; // Non-visual component, so it returns null
};

export default SocketListener;
