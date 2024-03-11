import React, { useCallback, useState } from 'react';
import { PapersList } from '~/shared/utils/types';
import DatesList from './days-list';
import DatesPlaceholder from './placeholder';

function Grid({ papersList }: { papersList: PapersList[] }): React.ReactElement {
  return (
    <>
      {
        papersList.length === 0
          ? <DatesPlaceholder />
          : <DatesList papersList={papersList} />
      }
    </>
  );
}

export default Grid;
