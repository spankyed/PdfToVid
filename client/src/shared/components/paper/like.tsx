import { Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Paper } from '~/shared/utils/types';

function Like ({ paper, allRed }: { paper: any, allRed?: boolean }): React.ReactElement {
  return (
    <Button>
      {/* <Fab aria-label="like">
        {
          paper.liked 
            ? <FavoriteIcon color="error" />
            : <FavoriteBorderIcon color="action" />
        }
      </Fab> */}
      {
        // paper.liked 
        true
          ? <FavoriteIcon color="error" />
          : <FavoriteBorderIcon color={allRed ? 'error' : 'action'} />
      }
    </Button>
  )
}

export default Like;
