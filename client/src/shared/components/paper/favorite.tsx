import { IconButton } from "@mui/material";
// import { Paper } from '~/shared/utils/types';

// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import * as  api from '../../api/fetch';
// import { useState } from "react";
import { Paper } from "~/shared/utils/types";
import { featureDisabledAlertAtom } from "../notification/store";
import { useSetAtom } from "jotai";

function Favorite ({ paper = {} }: { paper?: Partial<Paper> }): React.ReactElement {
  const featureDisabledAlert = useSetAtom(featureDisabledAlertAtom);
  const updateIsStarred = async () => {
    featureDisabledAlert();
  }

  return (
    <IconButton onClick={updateIsStarred}>
      {
        paper.isStarred
          ? <StarOutlinedIcon color="warning" />
          : <StarBorderOutlinedIcon color='warning' />
      }
    </IconButton>
  )
}

export default Favorite;
