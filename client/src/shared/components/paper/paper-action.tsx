import React from 'react';
import { Tooltip, Button } from '@mui/material';
import { PaperState } from '../../utils/types';

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PublishIcon from '@mui/icons-material/Publish';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const PaperAction = ({ state }) => {
  const renderAction = () => {
    switch (state) {
      case PaperState.initial:
        return <Tooltip title='Approve'><CheckOutlinedIcon color="warning" /></Tooltip>;
      case PaperState.approved:
        return <Tooltip title='Generate'><EditNoteOutlinedIcon color="success" /></Tooltip>;
      case PaperState.generated: // consider a draft action instead of publish from generated status
        return <Tooltip title='Upload'><PublishIcon color="secondary" /></Tooltip>;
      case PaperState.published:
        return <div>View</div>; // Assuming no icon is needed for 'uploaded' state
      default:
        return <div>Unknown State</div>;
    }
  };

  return (
    <Button>
      {renderAction()}
    </Button>
  );
};

const RejectAction = () => (
  <Button>
    <Tooltip title='Reject'>
      <ClearOutlinedIcon color='error' style={{ marginRight: '4px' }}/>
    </Tooltip>
  </Button>
);

export { RejectAction };
export default PaperAction;
