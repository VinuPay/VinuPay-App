import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NameSelector_CI from './createInvoiceSteps/NameSelector_CI';
import AddressInput_CI from './createInvoiceSteps/AddressInput_CI';
import TokenAmountInput_CI from './createInvoiceSteps/TokenAmountInput_CI';
import TimeSelector_CI from './createInvoiceSteps/TimeSelector_CI';
import ConfirmAndSend_CI from './createInvoiceSteps/ConfirmAndSend_CI';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import {Calls} from '../Onoffchain';
import * as imalConnect from '../imalConnect/index.js';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
const steps = [
  'Choose the name',
  'Enter destination address',
  'Set the amount and token',
  'Choose expiration time',
  'Review and create',
];

export default function CreateInvoiceStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [canContinue, setCanContinue] = React.useState(false);
  const [shouldLoad, setShouldLoad] = React.useState(false);
  // States for collected data
  const [selectedName, setSelectedName] = React.useState({});
  const [selectedAddress, setSelectedAddress] = React.useState('');
  const [selectedToken, setSelectedToken] = React.useState('');
  const [selectedAmount, setSelectedAmount] = React.useState('');
  const [selectedExpirationTime, setSelectedExpirationTime] = React.useState('');
  // That's just a straightforward copy from MUI docs
  const isStepOptional = (step) => {
    return false;
  };
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    setCanContinue(false);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // eslint-disable-next-line max-len
      // it should never occur unless someone's actively trying to break something.
      throw new Error('You can\'t skip a step that isn\'t optional.');
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  // Functions that are used to collect data from child components
  const nameSelected = (name) => {
    if (name === false) {
      setCanContinue(false);
      return;
    }
    setSelectedName(name);
    setCanContinue(true);
  };
  const addressEntered = (address) => {
    if (address === false || address === '') {
      setCanContinue(false);
    } else {
      setSelectedAddress(address);
      setCanContinue(true);
    }
  };
  const valueEntered = (value) => {
    if (!value) {
      console.log('Value is not valid');
      setCanContinue(false);
    } else {
      setSelectedAmount(value.amount);
      setSelectedToken(value.token);
      setCanContinue(true);
    }
  };
  const timeSelected = (time) => {
    if (!time) {
      console.log('Time is not valid');
      setCanContinue(false);
    } else {
      setSelectedExpirationTime(time);
      console.log(time);
      setCanContinue(true);
    }
  };

  const createInvoice = async () => {
    try {
      setShouldLoad(true);
      // You never know when JS simple math will fail you
      const expireBlocks = new BigNumber(selectedExpirationTime.unix()).minus(dayjs().unix());
      const amountRaw = new BigNumber(selectedAmount).shiftedBy(selectedToken.decimals);
      console.log(`Approximately ${expireBlocks.toFixed()} seconds to expiration time from NOW.`);
      console.log(`This number may differ by maximum of approx. 1 minute`);
      console.log(`Tx expires in: ${expireBlocks.toFixed()}`);
      console.log(`Selected name: ${selectedName.name}`);
      // destination,amount,token,expireBlocks,nameId
      const sendBlock = await Calls.createInvoice(
          selectedAddress,
          amountRaw.toFixed(),
          selectedToken.id,
          expireBlocks.toFixed(),
          selectedName.nameId,
      );
      const sendHash = await imalConnect.sendAccountBlock(sendBlock);
      const invoiceId = await Calls.getInvoiceIdFromSendHash(sendHash);
      toast(`Invoice created! Invoice ID: ${invoiceId}`);
      setShouldLoad(false);
      setActiveStep(0);
    } catch (e) {
      toast.error(`Error creating invoice: ${e.message}`);
      setShouldLoad(false);
      setActiveStep(0);
    }
  };
  return (
    <Box sx={{width: '100%', mt: 3}}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>
                <Typography sx={{display: {xs: 'none', lg: 'initial'}}}>{label}</Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{mt: 2, mb: 1}}>
                        All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                    <Box sx={{flex: '1 1 auto'}} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                  {/* This is where we should collect the data */}
                  <Typography sx={{mt: 2, mb: 1}}>Step {activeStep + 1}</Typography>
                  {/* Check step number, this can probably be improved, feel free to do it*/}
                  {activeStep === 0 ? <NameSelector_CI onNameSelect={nameSelected}/> : null}
                  {activeStep === 1 ? <AddressInput_CI onAddressInput={addressEntered}/> : null}
                  {activeStep === 2 ? <TokenAmountInput_CI onValueInput={valueEntered}/> : null}
                  {activeStep === 3 ? <TimeSelector_CI onTimeInput={timeSelected}/> : null}
                  {activeStep === 4 ?
                        <ConfirmAndSend_CI
                          name={selectedName}
                          address={selectedAddress}
                          token={selectedToken}
                          amount={selectedAmount}
                          expirationTime={selectedExpirationTime}
                        /> :
                        null}

                  {/* Step controls, leave this alone */}
                  <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{mr: 1}}
                    >
                            Back
                    </Button>
                    <Box sx={{flex: '1 1 auto'}}/>
                    {isStepOptional(activeStep) && (
                      <Button color="inherit" onClick={handleSkip} sx={{mr: 1}}>
                                Skip
                      </Button>
                    )}
                    {/* iMals awesome solution */}

                    {activeStep === steps.length - 1 ?
                            <LoadingButton
                              onClick={createInvoice}
                              loading={shouldLoad}
                              loadingPosition="start"
                              variant="contained"
                              disabled={!selectedExpirationTime}>
                              Create Invoice
                            </LoadingButton> :
                            <Button onClick={handleNext} disabled={!canContinue}>Next</Button>
                    }
                  </Box>
                </React.Fragment>
            )}
    </Box>
  );
}
