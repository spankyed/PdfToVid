import { useEffect } from 'react';
import { socket } from './fetch';

const SocketListener = ({ eventName, handleEvent }) => {
  useEffect(() => {
    const eventHandler = (eventData) => {
      handleEvent(eventData);
    };

    socket.on(eventName, eventHandler);

    return () => {
      socket.off(eventName, eventHandler);
    };
  }, [eventName, handleEvent]);

  return null;
};


export default SocketListener;
