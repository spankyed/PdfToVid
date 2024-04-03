import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Grid, Card, CardMedia, CardActions, TextField, Chip, Fab, ButtonGroup, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, PaperState } from '~/shared/utils/types';
import Like from '~/shared/components/paper/like';
import Relevancy from '~/shared/components/paper/relevancy';

// import SearchIcon from '@mui/icons-material/Search';

import { paperStates } from '~/shared/utils/paperStates';
import PaperAction from '~/shared/components/paper/paper-action';


const PapersTable: React.FC<{ papers: Paper[] }> = ({ papers }) => {
  const statusType = (paper: Paper) => paperStates[paper.status]
  const isUploaded = (paper: Paper) => paper.status === 3
  const hideDelete = (paper: Paper) => isUploaded(paper) || paper.status === 0
  
  return (
    <TableContainer sx={{ marginTop: 3, margin: '0 auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Paper Title</TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right" style={{ paddingRight: '5em' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {papers.map((paper, index) => (
            <TableRow key={index}>
              <TableCell 
                align="left" 
                sx={{ 
                  fontSize: '1.075rem', padding: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  }
                }}
              >
                <Link 
                  to={`/paper/${paper.id}`} 
                  style={{ 
                    display: 'block', 
                    padding: '1em', 
                    textDecoration: 'none', 
                    color: 'inherit', 
                  }}
                >
                  <Relevancy paper={paper} />
                  {paper.title}
                </Link>
              </TableCell>
              <TableCell align="center">
                <Like paper={paper}/>
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={statusType(paper).label} 
                  color={statusType(paper).color} 
                  title={statusType(paper).title}
                />
              </TableCell>
              <TableCell align="right">
                <ButtonGroup variant="text" aria-label="paper actions">
                  {
                    !isUploaded(paper) && (
                      <PaperAction state={paper.status} />
                    )
                  }
                  <Button>
                    <Tooltip title='View'>
                      <Link to={`/paper/${paper.id}`}>
                        <VisibilityIcon color="info" style={{ marginRight: '4px' }} />
                      </Link>
                    </Tooltip>
                  </Button>
                  <Button disabled={hideDelete(paper)}>
                    <Tooltip title='Delete'>
                      <DeleteIcon color={hideDelete(paper) ? undefined : 'error'} style={{ marginRight: '4px' }}/>
                    </Tooltip>
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PapersTable;
