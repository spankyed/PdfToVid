// src/components/PaperList.js

import React, { useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { StoreContext } from '../index';

function PaperList() {
  const store = useContext(StoreContext);

  // Assuming the store has a `papers` property that is an array of paper objects
  const papers = store.papers;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            {/* Other columns... */}
          </TableRow>
        </TableHead>
        <TableBody>
          {papers.map(paper => (
            <TableRow key={paper.id}>
              <TableCell>{paper.date}</TableCell>
              <TableCell>{paper.title}</TableCell>
              {/* Other cells... */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PaperList;
