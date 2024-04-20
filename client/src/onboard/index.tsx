import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import './onboard.css';
import PageLayout from '~/shared/components/layout/page-layout';
import { BackfillComponent } from '~/onboard/components/dates';
import OnboardingStepper from './components/stepper';
import ReferencesInput from './components/references';
import { canGoNextAtom, onboardSubmitAtom } from './store';
import UserSettings from './components/settings';

const steps = ['Dates', 'References', 'Finish'];

const OnboardPage = () => {
  return (
    <PageLayout padding={3}>
      <OnboardFlow />
    </PageLayout>
  );
}

function OnboardFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean; }>({});
  const submitForm = useSetAtom(onboardSubmitAtom);
  // const allStepsCompleted = () => {
  //   return Object.keys(completed).length === steps.length;
  // };

  const handleSkip = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);

    if (activeStep === 2) {
      submitForm();
    } else {
      handleSkip();
    }
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setCompleted({});
  // };

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
        {/* {allStepsCompleted() ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : ()} */}

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
                  handleNext,
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

  return null;
}

function NavigationButtons({ activeStep, steps, handleBack, handleSkip, handleNext }) {
  const canGoNext = useAtomValue(canGoNextAtom);
  const isLastStep = activeStep === steps.length - 1
  const isSecondStep = activeStep === 1
  const isFirstStep = activeStep === 0

  return (
    <Box sx={{ pt: 6, display: 'flex', justifyContent: 'center', width: '100%'}}>
      <div className='flex justify-between' style={{ width: '20rem' }}>
        <Button
          color="inherit"
          disabled={isFirstStep}
          onClick={handleBack}
        >
          <ArrowBackIcon/>
          Back
        </Button>
        {
          isSecondStep && (
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

        {!isLastStep ? (
          <Button
            disabled={!canGoNext}
            onClick={handleNext}
          >
            Next
            <ArrowForwardIcon sx={{ ml: 1 }}/>
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Finish
          </Button>
        )}
      </div>
    </Box>
  );
}


export default OnboardPage;
