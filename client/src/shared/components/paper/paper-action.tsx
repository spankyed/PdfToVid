import React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import PublishIcon from '@mui/icons-material/Publish';
import { Tooltip, Button } from '@mui/material';
import { PaperState } from '../../utils/types';

const PaperAction = ({ state }) => {
  const renderAction = () => {
    switch (state) {
      case PaperState.discarded:
        return <Tooltip title='Discard'><PublishIcon color="warning" /></Tooltip>;
      case PaperState.scraped:
        return <Tooltip title='Generate'><ArticleIcon color="success" /></Tooltip>;
      case PaperState.generated:
        return <Tooltip title='Upload'><CloudUploadIcon color="secondary" /></Tooltip>;
      case PaperState.uploaded:
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
