import { PaperState } from '~/shared/utils/types';

export const paperStates = {
  [PaperState.discarded]: {
    label: 'discarded',
    color: 'warning',
  },
  [PaperState.scraped]: {
    label: 'scraped',
    color: undefined,
  },
  [PaperState.generated]: {
    label: 'generated',
    color: 'success',
  },
  [PaperState.uploaded]: {
    label: 'uploaded',
    color: 'secondary',
  },
}
