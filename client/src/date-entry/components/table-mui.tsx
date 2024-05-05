import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { Chip, ButtonGroup, Button, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import PaperAction, { RejectAction } from '~/shared/components/paper/paper-action';
import Relevancy from '~/shared/components/paper/relevancy';
import { paperStates } from '~/shared/utils/paperStates';
import { PaperState } from '~/shared/utils/types';
import Favorite from '~/shared/components/paper/favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';


const VirtuosoTableComponents: TableComponents<any> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} sx={{ marginTop: 3, margin: '0 auto', minWidth: '100%' }}/>
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      <TableCell align="left">Paper Title</TableCell>
      <TableCell align="left"></TableCell>
      <TableCell align="center">Status</TableCell>
      <TableCell align="right" style={{ paddingRight: '3em' }}>Actions</TableCell>
    </TableRow>
  );
}
function rowContent(_index: number, paper: any) {

  console.log('paper: ', paper);
  // const paper = papers[index];
  const statusType = paperStates[paper.status]
  const notUploaded = paper.status !== PaperState.published
  const showReject = paper.status === PaperState.approved

  return (
    <>
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
    </>
  )
}


export default function PapersTable({ papers }) {
  return (
    <TableVirtuoso
      data={papers}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    />
  );
}
