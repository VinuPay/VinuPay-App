import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import VinuPayIcon from '../assets/icon_blue.svg';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VinuPayLogo from '../assets/logo_blue.svg';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {PayClient} from '../Onoffchain.js';
import * as cryptoInfo from '../viteChain/cryptoInfo.js';
import BigNumber from 'bignumber.js';
import * as utils from '@vite/vitejs-utils';
import * as imalConnect from '../imalConnect/index.js';
import StatsHandler from '../viteChain/statsHandler';
import {QRCode} from 'react-qrcode-logo';
export default function InvoicePanel(props) {
  const [invoice, setInvoice] = React.useState({});
  const [creatorName, setCreatorName] = React.useState('');
  const [invoiceToken, setInvoiceToken] = React.useState('');
  const [remainingTime, setRemainingTime] = React.useState(0);
  const [expireBlock, setExpireBlocks] = React.useState(0);
  const [mainDisplay, setMainDisplay] = React.useState('initial');
  const [expiredDisplay, setExpiredDisplay] = React.useState('none');
  const [successDisplay, setSuccessDisplay] = React.useState('none');
  const [notFoundDisplay, setNotFoundDisplay] = React.useState('none');
  const expireBlockRef = React.useRef();
  // noinspection JSConstantReassignment
  expireBlockRef.current = expireBlock;
  const [displayPayWithConnectedWallet, setDisplayPayWithConnectedWallet] = React.useState('none');
  React.useEffect(() => {
    async function run() {
      try {
        const invoiceID = props.txId;
        const invoiceA = await PayClient.getInvoice(invoiceID);
        console.log(invoiceA);
        const token = await cryptoInfo.getTokenInfo(invoiceA.txToken);
        const creatorName = await PayClient.getNameById(invoiceA.nameId);
        const connectionStatus = imalConnect.isConnected();
        if (connectionStatus) {
          setDisplayPayWithConnectedWallet('flex');
        } else {
          setDisplayPayWithConnectedWallet('none');
        }
        await setInvoice(invoiceA);
        await setInvoiceToken(token);
        await setCreatorName(creatorName.name + '.' + 'vinu');
        await setExpireBlocks(invoiceA.expireBlock);
        expirationCountdown();
      } catch (e) {
        if (e.name === 'NotFoundError') {
          console.log('Invoice not found');
          setMainDisplay('none');
          setNotFoundDisplay('flex');
        } else {
          console.log(e);
        }
      }
    }
    run();
    return () => {
      StatsHandler.statsEvents.off('statsUpdate', eventHandler);
    };
  }, []);
  const expirationCountdown = () => {
    if (StatsHandler.isSubscribed) {
      StatsHandler.statsEvents.on('statsUpdate', eventHandler);
    } else {
      StatsHandler.subscribeToBlocks();
      StatsHandler.statsEvents.on('statsUpdate', eventHandler);
    }
  };
  const eventHandler = async () => {
    // Means event fired
    const stats = StatsHandler.getStats();
    // Calculate remaining seconds
    const remainingBlocks = expireBlockRef.current - stats.height;
    // Check if invoice is paid
    const invoice = await PayClient.getInvoice(props.txId);
    console.log(invoice);
    if (invoice.status === 1) {
      // Invoice paid
      StatsHandler.statsEvents.off('statsUpdate', eventHandler);
      console.log('invoice paid');
      setMainDisplay('none');
      setSuccessDisplay('flex');
    } else if (invoice.status === 2) {
      // Invoice expired
      StatsHandler.statsEvents.off('statsUpdate', eventHandler);
      console.log('invoice expired');
      setMainDisplay('none');
      setExpiredDisplay('flex');
    }
    setRemainingTime(secondsToDhms(remainingBlocks));
  };
  const createPaymentQRCode = (txID) => {
    try {
      return utils.uriStringify({
        target_address: PayClient.contract.address,
        params: {amount: new BigNumber(invoice.amount).shiftedBy(-invoiceToken.decimals).toFixed(), data: btoa(txID)},
        function_name: 'pay',
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2.5,
        display: 'flex',
        boxShadow: 2,
        flexDirection: 'column',
        maxWidth: 1,
      }}>

      {/* Main page, not paid or expired */}
      <Container sx={{maxWidth: '100%', display: mainDisplay}} disableGutters>

        {/* Text */}
        <Container sx={{backgroundColor: 'background.primary', width: 1, p: 0}}>
          <Typography
            variant={'h5'}
            sx={{color: 'text.invoiceTop'}}>
            Please send the indicated amount to the address below with the memo
          </Typography>
        </Container>

        {/* Grid with logo, merchant info and qr code in a row*/}
        <Container sx={{display: 'flex', mt: 2, justifyContent: 'center'}}>
          <Grid container spacing={3} sx={{maxWidth: '100%'}} justifyContent="center">
            <Grid item xs={4} sx={{display: {xs: 'none', md: 'flex'}}}>
              <VinuPayIcon style={{transform: 'scale(1)'}}/>
            </Grid>
            <Grid item
              xs={4}
              sx={{mt: 'auto', mb: 'auto', maxWidth: '100%', textAlign: 'center'}}
              display="flex"
              flexDirection="column">
              <Typography
                variant="h3"
                sx={{fontWeight: 800, mb: 1}}>
                Vinu
                <Typography
                  display="inline"
                  variant="h3"
                  sx={{fontWeight: 800, color: '#006aff'}}>
                  Pay
                </Typography>
              </Typography>
              <Typography variant={'h5'}>{creatorName}</Typography>
              <Button
                variant="contained"
                sx={{mt: 2, display: displayPayWithConnectedWallet}}>
                Pay with connected wallet
              </Button>
              <Typography variant="h5" sx={{mt: 2}}>{remainingTime}</Typography>
            </Grid>
            <Grid item
              xs={4}
              display="flex"
              justifyContent="center"
              flexDirection="column"
              sx={{display: {xs: 'none', md: 'flex'}}}>
              <QRCode
                value={createPaymentQRCode(props.txId)}
                logoImage={<VinuPayIcon/>}
                logoWidth={50}
                logoHeight={50} size={200}
                fgColor='#006aff'
              />
            </Grid>
          </Grid>
        </Container>
        {/* Divider yes I know awesome using a container for it */}
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2, mb: 2}}>
          <Divider sx={{backgroundColor: 'background.primary', width: '60%'}}/>
        </Container>
        {/* Grid with address, amount and memo*/}
        <Container sx={{mb: 2, display: 'flex', textAlign: 'center'}}>
          <Grid container spacing={2} sx={{width: 1, ml: 'auto', mr: 'auto'}} direction="column">
            <Grid item xs={4}>
              <TextField label="Address" sx={{width: {xs: '90%', md: '75%'}}}
                defaultValue={PayClient.contract.address}
                InputProps={{readOnly: true}}
                variant="filled"
              />
            </Grid>
            {invoiceToken ?
              <Grid item xs={4}>
                <TextField
                  label="Amount"
                  sx={{width: {xs: '90%', md: '75%'}}}
                  defaultValue={new BigNumber(invoice.amount).shiftedBy(-invoiceToken.decimals).toFixed()}
                  InputProps={{readOnly: true}} variant="filled"/>
              </Grid> : null}
            <Grid item xs={4}>
              <TextField label="Invoice ID (Memo)" sx={{width: {xs: '90%', md: '75%'}}}
                defaultValue={props.txId}
                InputProps={{readOnly: true}}
                variant="filled"
              />
            </Grid>
          </Grid>
        </Container>
      </Container>

      {/* Paid centered both vertically and horizontally*/}
      <Container
        sx={{
          display: successDisplay,
          alignItems: 'center', justifyContent: 'center',
          mb: 'auto', mt: 'auto',
        }}>
        <DoneAllRoundedIcon style={{transform: 'scale(3)'}} color="secondary"/>
        <Typography variant="h4" sx={{ml: 5, fontWeight: 800}}>Invoice #{props.txId} has been paid</Typography>
      </Container>
      {/* Expired centered both vertically and horizontally*/}
      <Container
        sx={{
          display: expiredDisplay,
          alignItems: 'center', justifyContent: 'center',
          mb: 'auto', mt: 'auto',
        }}>
        <CloseRoundedIcon style={{transform: 'scale(3)'}} color="error"/>
        <Typography variant="h4" sx={{ml: 5, fontWeight: 800}}>Invoice #{props.txId} has expired</Typography>
      </Container>
      {/* Doesn't exist centered both vertically and horizontally*/}
      <Container
        sx={{
          display: notFoundDisplay,
          alignItems: 'center', justifyContent: 'center',
          mb: 'auto', mt: 'auto',
        }}>
        <CloseRoundedIcon style={{transform: 'scale(3)'}} color="error"/>
        <Typography variant="h4" sx={{ml: 5, fontWeight: 800}}>Invoice #{props.txId} doesn&apos;t exist!</Typography>
      </Container>
    </Box>
  );
}
// https://stackoverflow.com/a/52387803/17751151
function secondsToDhms(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600*24));
  const h = Math.floor(seconds % (3600*24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days ') : '';
  const hDisplay = h > 0 ? h + (h === 1 ? ' hr, ' : ' hrs ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' min, ' : ' mins ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' sec' : ' secs ') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}
