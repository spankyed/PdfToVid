import { useAtom } from 'jotai';
import { pdfModalOpen } from '../store';
import ModalWrapper from '~/shared/components/modal';
import PdfViewer from './pdf-viewer';

function PdfModal() {
  const [open, setOpen] = useAtom(pdfModalOpen);
  const handleClose = () => setOpen(false);

  return (
      <ModalWrapper open={open} handleClose={handleClose} width={900}>
        <PdfViewer url="https://arxiv.org/pdf/quant-ph/0410100.pdf" />
      </ModalWrapper>
  );
}

export default PdfModal;
