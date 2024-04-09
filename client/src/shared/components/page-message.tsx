import React, { useContext } from 'react';
import { useAtom } from 'jotai';

const PageMessage = ({ message }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto my-8">
      <div className="font-medium text-gray-800 text-lg mb-2">{message}</div>
    </div>
  );
};

export default PageMessage;
