import React, { useState } from 'react';
import { Box, Grid, Checkbox, Typography, TextField } from '@mui/material';

function UserSettings() {
    const [autoAddDates, setAutoAddDates] = useState(true);
    const [autoScrapeDates, setAutoScrapeDates] = useState(true);
    const [pauseDays, setPauseDays] = useState('14');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
      <Typography 
        style={{ marginBottom: '2rem'}}
        variant="h3">
        User Settings
      </Typography>
      <Typography>
        These settings control how new dates are added. The default settings are highly recommended.
      </Typography>
      <Typography>
        If you choose to not automagically add dates, you can still manually add new dates using the backfill page.
      </Typography>

        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ maxWidth: 500, m: 'auto', p: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Checkbox
                  checked={autoAddDates}
                  onChange={(event) => setAutoAddDates(event.target.checked)}
                />
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body1">Automatically add new dates</Typography>
                <Typography variant="body2" color="textSecondary">
                  While running, the app automatically adds a new date each night. If you're starting the app after a long break, it will backfill dates for up to —
                  {` ${pauseDays}`} days. 
                </Typography>
              </Grid>

              <Grid item xs={3}>
                <Checkbox
                  checked={autoScrapeDates}
                  onChange={(event) => setAutoScrapeDates(event.target.checked)}
                />
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body1">Automatically scrape new dates</Typography>
                <Typography variant="body2" color="textSecondary">
                  In addition to adding a new date, scrape and rank papers for that day. If no papers are found while scraping, retry attempts are made every 6 hours. A new date will only appear after the day's papers have been successfully scraped.
                </Typography>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  type="number"
                  value={pauseDays}
                  onChange={(event) => setPauseDays(event.target.value)}
                  inputProps={{ min: 1, max: 90, sx: { height: 10 } }}
                  sx={{ width: 70 }}
                />
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body1">Maximum days to backfill</Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage the above settings by limiting how many days are added and scraped when you return to the app after an extended absence.
                </Typography>
              </Grid>
            </Grid>
        </Box>
        </div>
      </div>


    );
}

export default UserSettings;
