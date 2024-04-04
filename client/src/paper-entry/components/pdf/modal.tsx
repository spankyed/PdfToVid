import { useAtom } from 'jotai';
import { pdfModalOpen } from '../../store';
import ModalWrapper from '~/shared/components/modal';
import PdfViewer from './pdf-viewer';
import { useEffect, useState } from 'react';

function PdfModal({ urlId }) {
  const [open, setOpen] = useAtom(pdfModalOpen);
  const handleClose = () => setOpen(false);
  const url = `https://arxiv.org/pdf/${urlId}.pdf`;

  const [width, setCalculatedWidth] = useState(750); // Default width

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const calculatedWidth = viewportWidth > 1024 ? viewportWidth * 0.4 : 750;
    setCalculatedWidth(calculatedWidth)
  }, []);

  return (
      <ModalWrapper open={open} handleClose={handleClose} width={width}>
        <PdfViewer url={url} width={width - 100}/>
      </ModalWrapper>
  );
}

export default PdfModal;
