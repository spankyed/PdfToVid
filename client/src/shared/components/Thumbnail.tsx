import React, { useContext } from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Paper } from '~/shared/utils/types';
import { getThumbnailUrl, paperStates } from '../utils/constants';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Like from './like';
import Relevancy from './relevancy';
import { getColorShadeRedToGreen } from '../utils/getColorShade';

// const colors = {
//   0: 'rgba(237, 108, 3, 1)',
//   1: 'rgba(235, 235, 235, 1)',
//   2: 'rgba(47, 124, 49, 1)',
//   3: 'rgba(156, 39, 176, 1)',
// }

function Thumbnail ({ paper, shadow = false }: { paper: Paper, shadow?: boolean }): React.ReactElement {
  const navigate = useNavigate();

  const onThumbnailClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const is = (tag: string) => (e.target as HTMLElement).tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('LI');

    if (ignore) return;

    // console.log('paper: ', paper);
    navigate(`/paper/${paper.id}`);
  }
  return (

    <div
      onClick={onThumbnailClick} key={paper.id}
      style={{ 
        cursor: 'pointer',
        position: 'relative',
        width: '320px', 
        height: '180px',  
        borderBottom: `10px solid ${getColorShadeRedToGreen(paper.relevancy)}`,
        // boxShadow: shadow ? '0px 2px 15px rgba(0, 0, 0, 0.6)' : 'none',
      }}
      className='thumb-img'
    >
      <img src={getThumbnailUrl(paper)} alt={paper.title} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '4px',
          borderBottomRightRadius: '0px',
          borderBottomLeftRadius: '0px',
      }}/>
      {/* <LikeBtn paper={paper} /> */}
      <Actions paper={paper} />
      <PaperTitle paper={paper} />
    </div>
  )
}
function Actions ({ paper }: { paper: Paper }): React.ReactElement {
  const statusFrom = (paper: Paper) => paperStates[paper.status]
  const isUploaded = (paper: Paper) => paper.status === 3
  const hideDelete = (paper: Paper) => isUploaded(paper) || paper.status === 0
  
  const onViewClick = (e) => {
    e.stopPropagation()

    window.open(`https://arxiv.org/abs/${paper.id}`, '_blank')
  }


  return (
    <>
      <ButtonGroup 
        variant='outlined' 
        aria-label="paper actions"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          // padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Translucent black background
          // color: 'white',
          // textAlign: 'center',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
        }}
      >
        <Like paper={paper} allRed={true}/>
        <Button onClick={onViewClick}>
          <Tooltip title='View on Arxiv'>
            <VisibilityIcon color="info" style={{ marginRight: '4px' }} />
          </Tooltip>
        </Button>
      {
        !isUploaded(paper) && (
          <>
            <Button>
              <Tooltip title={statusFrom(paper).action}>
                {statusFrom(paper).icon}
              </Tooltip>
            </Button>
          {
            paper.status !== 0 && (
              <Button disabled={hideDelete(paper)}>
                <Tooltip title='Delete'>
                  <DeleteIcon color={hideDelete(paper) ? undefined : 'error'} style={{ marginRight: '4px' }}/>
                </Tooltip>
              </Button>
            )
          }
          </>
        )
      }
      </ButtonGroup>
    </>
  )
}
function LikeBtn ({ paper }: { paper: Paper }): React.ReactElement {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      // padding: '8px',
      // backgroundColor: 'rgba(0, 0, 0, 0.6)', // Translucent black background
      color: 'white',
      // textAlign: 'center',
      // borderBottomLeftRadius: '4px',
      // borderBottomRightRadius: '4px',
    }}>
    </div>
  )
}
function PaperTitle ({ paper }: { paper: Paper }): React.ReactElement {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Translucent black background
      color: 'white',
      textAlign: 'left',
    }}>

      {/* <Relevancy paper={paper}/> */}

        <span>
          {paper.title}
        </span>


    </div>
  )
}

export default Thumbnail;
