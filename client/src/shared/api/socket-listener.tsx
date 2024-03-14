import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { socket } from './fetch';
import handlers from './ws-handlers';
import { papersListAtom } from '~/calender/components/grid/store';

const SocketListener = () => {
  const setPapersList = useSetAtom(papersListAtom);

  useEffect(() => {
    const socketHandlers = { 
      day_status: handlers.day_status(setPapersList),
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
  }, [setPapersList]);

  return null; // Non-visual component, so it returns null
};

export default SocketListener;
