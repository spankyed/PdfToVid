import React, { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

export default function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    console.log('onDocumentLoadSuccess: ');
    setNumPages(numPages);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage(event) {
    event.preventDefault();

    changePage(-1);
  }

  function nextPage(event) {
    event.preventDefault();

    changePage(1);
  }

  return (
    <div className="pdf-viewer p-2" style={{ display: 'flex', flexDirection: 'column-reverse'}}>
      
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        <Page pageNumber={pageNumber} width={700} loading={<div>Loading...</div>}/>
      </Document>
      <Pagination
        pageNumber={pageNumber}
        numPages={numPages}
        onPreviousPage={previousPage}
        onNextPage={nextPage}
      />
    </div>
  );
}

function Pagination({ pageNumber, numPages, onPreviousPage, onNextPage }) {
  return (
    <div className="page-controls">
      <button
        type="button"
        disabled={pageNumber <= 1}
        onClick={onPreviousPage}
      >
        ‹
      </button>
      <span>
        {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
      </span>
      <button
        type="button"
        disabled={pageNumber >= numPages}
        onClick={onNextPage}
      >
        ›
      </button>
    </div>
  );
}