import { useAtom } from 'jotai';
import { pdfModalOpen } from '../store';
import ModalWrapper from '~/shared/components/modal';
import PdfViewer from './pdf-viewer';

function PdfModal({ urlId }) {
  const [open, setOpen] = useAtom(pdfModalOpen);
  const handleClose = () => setOpen(false);
  const url = `https://arxiv.org/pdf/${urlId}.pdf`;

  return (
      <ModalWrapper open={open} handleClose={handleClose} width={900}>
        <PdfViewer url={url} />
      </ModalWrapper>
  );
}

export default PdfModal;
