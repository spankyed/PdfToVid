import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';

type ResultsTableProps = { dates?: any[]; isLoading?: boolean; placeholderRows?: number }
const ResultsTable: React.FC<ResultsTableProps> = ({
  dates = [],
  isLoading = false,
}) => {
  return (
    <TableContainer sx={{ marginTop: 3, margin: '0 auto', minWidth: '100%' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Count</TableCell>
            <TableCell align="right" style={{ paddingRight: '3em' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>

          <TableRow>
            <TableCell align="left">
              {dayjs().format('MM/DD/YYYY')}
            </TableCell>
            <TableCell align="left">92</TableCell>
            <TableCell align="right">[view]</TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResultsTable;
