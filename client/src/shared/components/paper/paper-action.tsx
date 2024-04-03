import React from 'react';
import { Tooltip, Button } from '@mui/material';
import { PaperState } from '../../utils/types';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PublishIcon from '@mui/icons-material/Publish';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';

const PaperAction = ({ state }) => {
  const renderAction = () => {
    switch (state) {
      case PaperState.pending:
        return <Tooltip title='Approve'><CheckOutlinedIcon color="warning" /></Tooltip>;
      case PaperState.approved:
        return <Tooltip title='Generate'><EditNoteOutlinedIcon color="success" /></Tooltip>;
      case PaperState.generated:
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

export default PaperAction;
