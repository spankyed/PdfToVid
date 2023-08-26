import React, { useContext } from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../index';
import { Paper, StoreType } from '../store';
import { observer } from 'mobx-react-lite';
import { getThumbnailUrl, statuses } from '../constants';
import DeleteIcon from '@mui/icons-material/Delete';
import Like from './Like';
import Relevancy from './Relevancy';
import Zoom from '@mui/material/Zoom';

const colors = {
  0: 'rgba(237, 108, 3, 1)',
  1: 'rgba(235, 235, 235, 1)',
  2: 'rgba(47, 124, 49, 1)',
  3: 'rgba(156, 39, 176, 1)',
}

function Thumbnail ({ paper, shadow = false }: { paper: Paper, shadow?: boolean }): React.ReactElement {
  const onThumbnailClick = (e) => e.stopPropagation()

  return (
    <Link to={`/entry/${paper.id}`} onClick={onThumbnailClick} key={paper.id}>
      <div 
        style={{ 
          position: 'relative', 
          width: '320px', 
          height: '180px',  
          borderBottom: `10px solid ${colors[paper.metaData.status]}`,
          borderBottomRightRadius: '4px',
          borderBottomLeftRadius: '4px',
          boxShadow: shadow ? '0px 2px 15px rgba(0, 0, 0, 0.6)' : 'none', 
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
    </Link>
  )
}
function Actions ({ paper }: { paper: Paper }): React.ReactElement {
  const statusFrom = (paper: Paper) => statuses[paper.metaData.status]
  const isUploaded = (paper: Paper) => paper.metaData.status === 3
  const hideDelete = (paper: Paper) => isUploaded(paper) || paper.metaData.status === 0
  
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
      {
        !isUploaded(paper) && (
          <>
            <Button>
              <Tooltip title={statusFrom(paper).action}>
                {statusFrom(paper).icon}
              </Tooltip>
            </Button>
          {
            paper.metaData.status !== 0 && (
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
      cursor: 'pointer'
    }}>

      <Relevancy paper={paper}/>
      <Tooltip 
        title={<span style={{ fontSize: '1.2em' }}>{paper.abstract}</span>}
        followCursor
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 600 }}
      >
        <span>
          {paper.title}
        </span>
      </Tooltip>
    </div>
  )
}

export default observer(Thumbnail);
