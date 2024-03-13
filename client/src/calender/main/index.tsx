import React, { useCallback, useContext, useState } from 'react';
import { useAtom } from 'jotai';
import { papersListAtom } from '../../shared/store';
import Grid from './grid';
import { hasDatesAtom } from './store';
import { BackfillComponent } from './backfill';

function Papers(): React.ReactElement {
  const [papersList] = useAtom(papersListAtom);
  const [hasDates] = useAtom(hasDatesAtom);

  return (
    <>
      { !hasDates 
        ? <BackfillComponent />
        : <Grid papersList={papersList} />
      }
    </>
  );
}

export default Papers;
