import React, { useContext } from 'react';
import { Box, Typography, ImageList, ImageListItem, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../index';
import { Paper, StoreType } from '../shared/store';
import { observer } from 'mobx-react-lite';


const Papers: React.FC = observer(() => {
  const store = useContext<StoreType>(StoreContext);
  const navigate = useNavigate();
  const { state, papersList, selectedDay, selectDay} = store.dashboard;
  
  function reformatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: '2-digit'
    });
  
    // Split the formatted string to extract the weekday, month, and day
    const [weekday, month, day] = formatted.split(' ');
  
    return `${weekday} ${month} ${day}`;
  }
  
  return (
    <>
      {papersList.map(({ day, papers }) => (
        <Box 
          key={day} 
          onMouseEnter={() => selectDay(day)}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            paddingTop: 2,  
            paddingBottom: 2,
            backgroundColor: selectedDay === day ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/day/${day}`)}
        >
          <Typography variant="h5" style={{ textDecoration: 'none', marginBottom: 4 }} >
            {reformatDate(day)}
          </Typography>
          {
            papers.length === 0 
            ? <EmptyState day={day}/> 
            : <PapersList papers={papers} />
          }
        </Box>
      ))}
    </>
  );
})

function PapersList({ papers }: { papers: Paper[] }): React.ReactElement {
  return (
    <>
      <ImageList cols={papers.length} sx={{ padding: 3 }}>
        {papers.map(paper => (
          <Link to={`/entry/${paper.id}`} key={paper.id}>
            <ImageListItem>
              <div title={paper.abstract} style={{ 
                position: 'relative',
                width: '320px', height: '180px',
                }}>
                {/* <img 
                  // src={`${paper.imgUrl}`}
                  src={`${paper.video.thumbnailUrl}?w=164&h=164&fit=crop&auto=format`}
                  alt={paper.title}
                  >
                </img> */}
                <img src={paper.video.thumbnailUrl || 'assets/arxiv-bg.jpg'} alt={paper.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    borderRadius: '4px',
                  }} 
                  />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Translucent black background
                  color: 'white',
                  textAlign: 'center',
                  borderBottomLeftRadius: '4px',
                  borderBottomRightRadius: '4px',
                }}>
                  {paper.title}
                </div>
              </div>
            </ImageListItem>
          </Link>
        ))}
      </ImageList>

    </>
  )
}

function EmptyState({ day }: { day: string }): React.ReactElement {
  const store = useContext<StoreType>(StoreContext);
  const { scrapePapers } = store.dashboard;

  const scrape = () => {
    console.log('scrapePapers');
    scrapePapers(day);
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} margin={3}>
      <Typography variant="h3">No Papers Scraped</Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" disabled>Full auto</Button>
        <Button variant="contained" color="secondary" disabled>Scrape & generate</Button>
        <Button 
          variant="outlined"
          onClick={scrape}
        >
          Scrape
        </Button>
      </Box>
    </Box>
  );
}

export default Papers;
