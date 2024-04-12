import { Button } from "@mui/material";
// import { Paper } from '~/shared/utils/types';

// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import * as  api from '../../api/fetch';
// import { useState } from "react";
import { Paper } from "~/shared/utils/types";

function dispatchPaperUpdate(id, isStarred) {
  const event = new CustomEvent('paperUpdate', {
    detail: { id, isStarred },
  });

  window.dispatchEvent(event);
}

function Favorite ({ paper = {} }: { paper?: Partial<Paper> }): React.ReactElement {
  const updateIsStarred = async () => {
    const id = paper.id
    if (!id) {
      return;
    }

    const newState = !paper.isStarred;
    await api.updateIsStarred(id, newState)

    dispatchPaperUpdate(id, newState)
  }

  return (
    <Button
      onClick={updateIsStarred}
    >
      {
        paper.isStarred
          ? <StarOutlinedIcon color="warning" />
          : <StarBorderOutlinedIcon color='warning' />
      }
    </Button>
  )
}

export default Favorite;
