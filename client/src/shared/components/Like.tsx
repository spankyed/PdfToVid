import { Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import { Paper } from "../store";

function Like ({ paper, allRed }: { paper: any, allRed?: boolean }): React.ReactElement {
  return (
    <Button>
      {/* <Fab aria-label="like">
        {
          paper.metaData.liked 
            ? <FavoriteIcon color="error" />
            : <FavoriteBorderIcon color="action" />
        }
      </Fab> */}
      {
        // paper.metaData.liked 
        true
          ? <FavoriteIcon color="error" />
          : <FavoriteBorderIcon color={allRed ? 'error' : 'action'} />
      }
    </Button>
  )
}

export default Like;
