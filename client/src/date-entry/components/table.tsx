import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, ButtonGroup, Tooltip, Skeleton } from '@mui/material';
import { Paper, PaperState } from '~/shared/utils/types';
import Favorite from '~/shared/components/paper/favorite';
import Relevancy from '~/shared/components/paper/relevancy';
import { paperStates } from '~/shared/utils/paperStates';
import PaperAction, { RejectAction } from '~/shared/components/paper/paper-action';

// import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PapersTable: React.FC<{ papers: Paper[]; isLoading?: boolean  }> = ({ papers, isLoading = false }) => {
  return (
    <TableContainer sx={{ marginTop: 3, margin: '0 auto', minWidth: '100%' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Paper Title</TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right" style={{ paddingRight: '3em' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {
            isLoading
            ? <TablePlaceholder />
            : <TableRows papers={papers}/>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TableRows = ({papers}) => {
  const statusType = (paper: Paper) => paperStates[paper.status]
  const notUploaded = (paper: Paper) => paper.status !== PaperState.published
  const showReject = (paper: Paper) => paper.status === PaperState.approved

  return (
    <>
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
          <Favorite paper={paper}/>
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
              // notUploaded(paper) && (
                <PaperAction state={paper.status} />
              // )
            }
            <Button>
              <Tooltip title='View'>
                <Link to={`/paper/${paper.id}`}>
                  <VisibilityIcon color="info" style={{ marginRight: '4px' }} />
                </Link>
              </Tooltip>
            </Button>
            {
              showReject(paper) && (
                <RejectAction/>
              )
            }
          </ButtonGroup>
        </TableCell>
      </TableRow>
    ))}
    </>
  )
}

const TablePlaceholder = () => {
  const rows = 5;

  return (
    <>
      {Array.from(new Array(rows)).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton animation="wave" height={50} width="80em" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" height={50} width="2em" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" height={50} width="100%" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" height={50} width="100%" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default PapersTable;
