import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingButton from '@mui/lab/LoadingButton';
import Check from '@mui/icons-material/Check';

import './onboard.css';
import PageLayout from '~/shared/components/layout/page-layout';
import { BackfillComponent } from '~/onboard/components/dates';
import OnboardingStepper from './components/stepper';
import ReferencesInput from './components/references';
import { apiKeyOpenAIAtom, autoScrapeDatesAtom, canGoNextAtom, inputIdsAtom, onboardingStateAtom, startDateAtom } from './store';
import UserSettings from './components/settings';
import { useNavigate } from 'react-router-dom';
import * as api from '~/shared/api/fetch';
import { addAlertAtom } from '~/shared/components/notification/store';
import { setSidebarDataAtom } from '~/shared/components/layout/sidebar/dates/store';
import { isNewUserAtom } from '~/shared/components/layout/store';
import { colors } from '~/shared/styles/theme';

const steps = ['References', 'Finish'];

const OnboardPage = () => {
  return (
    <PageLayout padding={3}>
      <OnboardFlow />
    </PageLayout>
  );
}

function OnboardFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setStepperCompleted] = useState<{ [k: number]: boolean; }>({});

  const setOnboardingState = useSetAtom(onboardingStateAtom);
  const startDate = useAtomValue(startDateAtom);
  const inputIds = useAtomValue(inputIdsAtom);
  const autoScrapeNewDates = useAtomValue(autoScrapeDatesAtom);

  const setSidebarData = useSetAtom(setSidebarDataAtom);
  const setIsNewUser = useSetAtom(isNewUserAtom);
  const apiKeyOpenAI = useAtomValue(apiKeyOpenAIAtom);
  const addAlert = useSetAtom(addAlertAtom);
  const navigate = useNavigate();

  async function submitForm(){
    const form = {
      startDate: startDate?.format('YYYY-MM-DD'),
      inputIds,
      config: {
        autoScrapeNewDates,
        apiKeyOpenAI
      }
    }

    setOnboardingState('loading');

    try {
      const response = await api.onboard(form);
      const dateList = response.data;
      if (dateList.length) {
        setSidebarData(dateList)
      }
      setIsNewUser(false);

      navigate(`/backfill?isNewUser=true`);
    } catch (error) {
      addAlert({ message: 'Failed to complete onboarding due to a server error.' });
      setOnboardingState('onboarding');
      console.error("Failed to backfill data", error);
    }
  }

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
    setStepperCompleted(newCompleted);

    if (activeStep === steps.length - 1) {
      submitForm();
    } else {
      handleSkip();
    }
  };


  // const handleReset = () => {
  //   setActiveStep(0);
  //   setStepperCompleted({});
  // };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
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
            <Paper
              elevation={2}
              style={{
                backgroundColor: colors.palette.background.paper,
                paddingTop: '2rem', marginTop: '3rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                height: '35rem', width: '70rem', overflow: 'auto'
              }}
              className='px-12 mx-auto'
            >
              <RenderByState activeStep={activeStep} />
            </Paper>

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
      return <ReferencesInput />;
    case 1:
      return <UserSettings />;
  }

  return null;
}

function NavigationButtons({ activeStep, steps, handleBack, handleSkip, handleNext }) {
  const canGoNext = useAtomValue(canGoNextAtom);
  const state = useAtomValue(onboardingStateAtom);
  const isLastStep = activeStep === steps.length - 1
  const isFirstStep = activeStep === 0

  return (
    <Box sx={{ pt: 6, display: 'flex', justifyContent: 'center', width: '100%'}}>
      <div className='flex justify-between' style={{ width: '20rem' }}>
        <Button
          color='secondary'
          variant='contained'
          disabled={isFirstStep || state === 'loading'}
          onClick={handleBack}
        >
          <ArrowBackIcon sx={{ height: 20, width: 20 }}/>
          Back
        </Button>
        {
          isFirstStep && (
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
            variant='contained'
            disabled={!canGoNext}
            onClick={handleNext}
          >
            Next
            <ArrowForwardIcon sx={{ ml: 1, height: 20, width: 20 }}/>
          </Button>
        ) : (
          <LoadingButton
            variant='contained'
            onClick={handleNext}
            loading={state === 'loading'}
          >
            Finish
            <Check sx={{ ml: 1, mt: -.75 }} />
          </LoadingButton>
        )}
      </div>
    </Box>
  );
}

export default OnboardPage;
