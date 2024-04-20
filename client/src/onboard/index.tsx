import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box } from '@mui/material';

import './onboard.css';
import PageLayout from '~/shared/components/layout/page-layout';
import { BackfillComponent } from '~/onboard/components/dates';
import OnboardingStepper from './components/stepper';
import ReferencesInput from './components/references';

import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { canGoNextAtom } from './store';
import UserSettings from './components/settings';

const OnboardPage = () => {
  // const [, backFillFetch] = useAtom(backFillFetchAtom);
  // const handleSubmit = () => {
  //   if (value) {
  //     const formattedDate = value.format('YYYY-MM-DD');
  //     backFillFetch(formattedDate);
  //   }
  // };

  return (
    <PageLayout padding={3}>
      <OnboardFlow />
    </PageLayout>
  );
}

const steps = ['Dates', 'References', 'Finish'];

function OnboardFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };


  const handleSkip = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleSkip();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: '100%' }}>
      <OnboardingStepper {
        ...{
          steps,
          activeStep,
          completed,
          handleStep, 
        }
      }/>
      <div>
        {/* {allStepsCompleted() ? () : ()} */}
        {/* <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </> */}
        
          <>
            <Box sx={{ minHeight: '20rem'}}>
              <RenderByState activeStep={activeStep} />
            </Box>
            <NavigationButtons 
              {
                ...{
                  activeStep,
                  steps,
                  handleBack,
                  handleSkip,
                  handleComplete,
                  completedSteps,
                  totalSteps
                }
              }
            />
          </>
      </div>
    </Box>
  );
}


const RenderByState = ({ activeStep }) => {
  switch (activeStep) {
    case 0:
      return <BackfillComponent />;
    case 1:
      return <ReferencesInput />;
    case 2:
      return <UserSettings />;
  }
}

function NavigationButtons({ activeStep, steps, handleBack, handleSkip, handleComplete, completedSteps, totalSteps }) {
  const canGoNext = useAtomValue(canGoNextAtom);

  return (
    <Box sx={{ pt: 6, display: 'flex', justifyContent: 'center', width: '100%'}}>
      <div className='flex justify-between' style={{ width: '20rem' }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          <ArrowBackIcon/>
          Back
        </Button>
        {
          activeStep === 1 && (
            <Button
              disabled={canGoNext}
              onClick={handleSkip}
              sx={{ mr: 1 }}
              color="inherit"
            >
              Skip
            </Button>
          )
        }

        {activeStep !== steps.length - 1 ? (
          <Button
            disabled={!canGoNext}
            onClick={handleComplete}
          >
            Next
            <ArrowForwardIcon sx={{ ml: 1 }}/>
          </Button>
        ) : (
          <Button onClick={handleComplete}>
            {
              completedSteps() === totalSteps() - 1
                ? 'Finish'
                : (
                  <>
                    Finish?
                    <ArrowForwardIcon sx={{ ml: 1 }}/>
                  </>
                )
              }
          </Button>
        )}
      </div>
    </Box>
  );
}


export default OnboardPage;
