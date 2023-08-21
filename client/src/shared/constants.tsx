import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ArticleIcon from '@mui/icons-material/Article';
import { Paper } from './store';

// export const rootPath = 'http://localhost:5173/assets/arxiv-bg.jpg'
export const rootAssetsPath = 'http://localhost:5173/assets/'

export const getThumbnailUrl = (paper: Paper) => {
  return paper.video.thumbnailUrl
    ? `${rootAssetsPath}thumbnails/${paper.video.thumbnailUrl}`
    : `${rootAssetsPath}thumbnails/default/arxiv-bg.jpg`
}

export const statuses = {
  0: {
    label: 'discarded',
    color: 'warning',
    action: 'Discard',
    icon: <AutorenewIcon color="warning" />
  },
  1: {
    label: 'scraped',
    color: undefined,
    action: 'Generate',
    icon: <ArticleIcon color="success" />
  },
  2: {
    label: 'generated',
    color: 'success',
    action: 'Upload',
    icon: <CloudUploadIcon color="secondary" />
  },
  3: {
    label: 'uploaded',
    color: 'secondary',
    action: 'View',
    icon: null
  },
}
