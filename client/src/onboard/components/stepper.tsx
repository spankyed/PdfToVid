import * as React from 'react';
import { styled } from '@mui/material/styles';
import { StepConnector, stepConnectorClasses, StepIconProps, Stack, Stepper, Step, StepLabel, Box } from '@mui/material';

import Check from '@mui/icons-material/Check';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StarIcon from '@mui/icons-material/Star';

const StepConnectorStyled = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(138,35,135) 0%,rgb(233,64,87) 50%,rgb(242,113,33) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const IconStyled = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function IconWrapper(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <DateRangeIcon />,
    2: <StarIcon />,
    3: <Check />,
  };

  return (
    <IconStyled ownerState={{ completed, active }} className={`${className} mb-3 p-0`}>
      {icons[String(props.icon)]}
    </IconStyled>
  );
}

export default function OnboardingStepper({ steps, activeStep, completed, handleStep }) {

  return (
    <Box sx={{ width: '100%' }} className='flex justify-center'>
      <Stepper sx={{ width: '70%' }} nonLinear activeStep={activeStep} connector={<StepConnectorStyled/>}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepLabel
              StepIconComponent={IconWrapper}
              onClick={handleStep(index)}
              sx={{ display: 'flex', flexDirection: 'column' }}
              className='StepLabel'
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}