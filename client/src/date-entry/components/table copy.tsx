import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, ButtonGroup, Tooltip, Skeleton } from '@mui/material';
import { Paper, PaperState } from '~/shared/utils/types';
import Favorite from '~/shared/components/paper/favorite';
import Relevancy from '~/shared/components/paper/relevancy';
import { paperStates } from '~/shared/utils/paperStates';
import PaperAction, { RejectAction } from '~/shared/components/paper/paper-action';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TableVirtuoso } from 'react-virtuoso';

const Row = (index, paper) => {
  console.log('paper: ', paper);
  const statusType = paperStates[paper.status]
  const notUploaded = paper.status !== PaperState.published
  const showReject = paper.status === PaperState.approved

  return (
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
          label={statusType.label} 
          color={statusType.color} 
          title={statusType.title}
        />
      </TableCell>
      <TableCell align="right">
        <ButtonGroup variant="text" aria-label="paper actions">
          {
            // notUploaded && (
              <PaperAction paper={paper} />
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
            showReject && (
              <RejectAction paper={paper}/>
            )
          }
        </ButtonGroup>
      </TableCell>
    </TableRow>
  )
}

const TableComponents = {
  // Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Scroller: React.forwardRef((props, ref) => <TableContainer {...props} ref={ref} />),
  Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} />,
  TableHead: TableHead,
  TableRow: TableRow,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
}

export default function PapersTable({ papers }) {
  console.log('papers: ', papers);
  return (
    <TableVirtuoso
      // style={{ height: 400 }}
      data={papers}
      components={TableComponents}
      fixedHeaderContent={() => (
        <TableRow>
          <TableCell align="left">Paper Title</TableCell>
          <TableCell align="left"></TableCell>
          <TableCell align="center">Status</TableCell>
          <TableCell align="right" style={{ paddingRight: '3em' }}>Actions</TableCell>
        </TableRow>
      )}
      itemContent={Row}
    />
  );
}
