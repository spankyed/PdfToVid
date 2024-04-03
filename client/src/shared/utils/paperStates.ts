import { PaperState } from '~/shared/utils/types';

export const paperStates = {
  [PaperState.pending]: {
    label: 'pending',
    color: 'primary',
    // color: undefined,
  },
  [PaperState.approved]: {
    label: 'approved',
    color: 'success',
  },
  [PaperState.generated]: {
    label: 'generated',
    color: 'warning',
  },
  [PaperState.published]: {
    label: 'published',
    color: 'secondary',
  },
}
