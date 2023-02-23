import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from '@mui/lab/LoadingButton';
import {PayClient} from '../Onoffchain.js';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InvoiceModal from './InvoiceModal';
export default function InvoiceLookup() {
  const [invoiceId, setInvoiceId] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);
  const [reason, setReason] = React.useState('');
  const [reasonId, setReasonId] = React.useState(undefined);
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const [invoiceExists, setInvoiceExists] = React.useState(false);
  function handleModalClose() {
    setInvoiceExists(false);
  }

  function checkInvoiceValidity(invoiceID) {
    // just plain regex ngl
    // only numbers
    const regex = /^[0-9]+$/;
    if (invoiceID.match(regex)) {
      setIsValid(true);
      setReason('');
      setReasonId(undefined);
      setInvoiceId(invoiceID);
    } else if (invoiceID === '') {
      setIsValid(true);
      setReason('');
      setReasonId(undefined);
      setInvoiceId(invoiceID);
    } else {
      setInvoiceId(invoiceID);
      setIsValid(false);
      setReason('Invalid Invoice ID');
      setReasonId(0);
    }
  }
  async function lookupInvoice() {
    if (isValid) {
      // Check if invoice exists
      setShouldLoad(true);
      const invoice = await PayClient.getInvoice(invoiceId).catch((e) => {
        setReason(e.message);
        setReasonId(1);
        setShouldLoad(false);
        setIsValid(false);
      });
      if (invoice) {
        setShouldLoad(false);
        setInvoiceExists(true);
      } else {
        setInvoiceExists(false);
        setReason('Invoice does not exist');
        setReasonId(1);
      }
    }
  }
  return (
    <Container>
      {/* Name "input" panel */}
      <Container style={{maxWidth: '100vw'}}>
        <Box
          sx={{
            'maxWidth': {xs: 350, sm: 480, md: 600, lg: 800},
            'borderWidth': 15,
            'borderStyle': 'solid',
            'borderColor': 'background.paper',
            'borderRadius': 4,
            'boxShadow': 8,
            'backgroundColor': 'background.paper',
            '&:hover': {
              backgroundColor: 'background.paper',
              opacity: [0.98, 0.93, 0.9],
            },
          }}
        >
          <Typography variant="h4" sx={{fontWeight: 700}}>Enter the invoice ID you&apos;d like to look up 📝</Typography>

          <FormControl sx={{m: 2, width: '26ch'}} variant="outlined">
            <OutlinedInput
              id="filled-basic"
              type="text"
              label="VinuPay Invoice ID"
              variant="filled"
              sx={{marginBottom: 2}}
              error={!isValid} onChange={(event) => {
                checkInvoiceValidity(event.target.value);
              }}/>
            <InputLabel htmlFor="filled-adornment-amount">VinuPay Invoice ID</InputLabel>
            <Typography
              variant="h6"
              display={reasonId === undefined ? 'none' : 'block'}
              color={isValid ? '#1eff18' : '#ff0000'}>
              {isValid ? 'Looking good!' : reason}
            </Typography>
          </FormControl>
          <br/>
          <LoadingButton
            onClick={() => {
              lookupInvoice();
            }}
            endIcon={<SearchRoundedIcon />}
            loading={shouldLoad}
            loadingPosition="end"
            variant="contained"
            color="secondary" sx={{minHeight: 50, minWidth: 120}}
            disabled={!isValid || invoiceId === ''}
          >
                        Look up
          </LoadingButton>
          <Typography
            variant="h3"
            sx={{fontWeight: 800, paddingTop: 5}}>
            Vinu
            <Typography
              display="inline"
              variant="h3"
              sx={{fontWeight: 800, color: '#006aff'}}>
              Pay 🎉
            </Typography>
          </Typography>
        </Box>

      </Container>
      {invoiceExists ? <InvoiceModal invoiceId={invoiceId} open={true} onClose={handleModalClose}/> : null}

    </Container>
  );
}
