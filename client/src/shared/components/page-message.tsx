import React, { useContext } from 'react';
import { useAtom } from 'jotai';
import { Paper } from '@mui/material';

const PageMessage = ({ message }) => {
  return (
    <Paper className="px-6 py-8 max-w-md mx-auto my-8">
      <div className="font-medium text-lg">{message}</div>
    </Paper>
  );
};

export default PageMessage;
