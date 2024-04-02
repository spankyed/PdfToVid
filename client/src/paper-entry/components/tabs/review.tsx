import React, { useState } from 'react';
import { Typography, Box, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, Grid, Select, 
  MenuItem, Checkbox, TextField, Button, CardMedia, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const ReviewTab: React.FC<{ entry: any }> = ({ entry }) => {
  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Metadata</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Metadata Level Content */}
          <Box>
            <TextField fullWidth label="Video Title" value={entry.videoTitle} sx={{ marginTop: 3}}/>
            <TextField fullWidth label="Keywords" value={entry.keywords} multiline sx={{ marginTop: 3, marginBottom: 3}} />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={entry.description}
              sx={{ marginTop: 3}}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Video</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Video Level Content */}
          <Box>
            <TextField
              fullWidth
              label="Script"
              multiline
              minRows={5}
              variant="outlined"
              value={entry.videoScript}
              sx={{ marginTop: 3}}
            />
            {/* Video Player Component */}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Thumbnail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Thumbnail Level Content */}
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={6} container justifyContent="center">
              <Box maxWidth="1280px" width="100%">
                <CardMedia
                  component="img"
                  image={entry.thumbnailLarge}
                  alt="Large Thumbnail"
                  style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                />
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                  <Select defaultValue={'white'}>
                    <MenuItem value="white">White</MenuItem>
                    <MenuItem value="black">Black</MenuItem>
                    {/* Add more colors if needed */}
                  </Select>
                  {/* <Checkbox /> */}
                  <FormControlLabel control={<Checkbox />} label="Seminal?" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} container direction="column" spacing={2}>
              <Grid item container justifyContent="center">
                <Box maxWidth="640px" width="100%">
                  <Button>Reroll</Button>
                  <CardMedia
                    component="img"
                    image={entry.thumbnailSmall1}
                    alt="Small Thumbnail 1"
                    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                  />
                  <TextField fullWidth label="Description"/>
                </Box>
              </Grid>
              <Grid item container justifyContent="center">
                <Box maxWidth="640px" width="100%">
                  <Button>Reroll</Button>
                  <CardMedia
                    component="img"
                    image={entry.thumbnailSmall2}
                    alt="Small Thumbnail 2"
                    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                  />
                  <TextField fullWidth label="Description"/>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
