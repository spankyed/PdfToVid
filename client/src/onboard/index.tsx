import React, { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { Button, Box, Divider } from '@mui/material';

import './onboard.css';
import PageLayout from '~/shared/components/layout/page-layout';

const OnboardPage: React.FC<{}> = () => {

  return (
    <PageLayout padding={3}>

      Onboarding
    </PageLayout>
  );
}

// const RenderByState = () => {
//   const [searchState] = useAtom(searchStateAtom);
//   // const searchState = 'loading';

//   switch (searchState) {
//     case 'pending':
//       return <PageMessage message={'Define search criteria then press search ...'}/>;
//     case 'loading':
//       return <Results isLoading={true} />;
//     case 'complete':
//       return <Results />;
//   }
// }

export default OnboardPage;
