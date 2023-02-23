import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import * as imalConnect from '../imalConnect/index.js';
import {QRCodeSVG} from 'qrcode.react';
import IconButton from '@mui/material/IconButton';
import WalletRoundedIcon from '@mui/icons-material/WalletRounded';
import toast from 'react-hot-toast';
import Grid2 from '@mui/material/Unstable_Grid2';
import LinkIcon from '@mui/icons-material/Link';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: 2,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
// With default props
export default function ConnectModal(props) {
  const forceUpdate = React.useReducer((x) => x + 1, 0)[1];

  // Modal open/close functions
  // Ondismount
  React.useEffect(() => {
    console.log('Modal mounted');
    imalConnect.connectEvents.on('disconnect', forceUpdate);
  }, []);
  React.useLayoutEffect(() => {
    console.log('componentWillUnmount');
    imalConnect.connectEvents.off('disconnect', forceUpdate);
  }, []);
  const [openModal, setModalOpen] = React.useState(false);
  const [connectionUri, setConnectionUri] = React.useState('');
  const handleModalOpen = () => {
    imalConnect.getConnection(true).then((result) => {
      setConnectionUri(result.vcUri);
      setModalOpen(true);
      imalConnect.awaitConnectionPromise.then(() => {
        setModalOpen(false);
      });
    }).catch((err) => {
      toast.error(err.message);
    });
  };
  const handleModalClose = () => {
    imalConnect.rejectAwaitConnectionPromise('Cancelled by user.');
    setModalOpen(false);
  };

  return (
    <>

      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            align="center"
            sx={{fontWeight: 700}}>
                    Connect Wallet
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            align="center"
            sx={{fontWeight: 600, marginTop: 2}}>
                    Scan the QR code with your Vite wallet to connect.
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{mt: 2}}
            align="center">
            <QRCodeSVG
              value={connectionUri}
              size="300"
              style={{borderColor: '#ffffff', borderWidth: 18, borderStyle: 'solid'}}/>
          </Typography>
          <Grid2 container
            justifyContent="center"
            spacing={2}
            sx={{marginTop: 2}}>
            <Grid2 item centered>
              <Button
                variant="contained"
                sx={{width: 350, height: 50, borderRadius: 2, fontSize: 17}}
                onClick={imalConnect.connectWithPassport}
                disabled={!imalConnect.getConnectionOptions().passport}
                startIcon={<LinkIcon />}>
                Connect with VitePassport
              </Button>
            </Grid2>
            <Grid2 item centered>
              <Button
                variant="contained"
                sx={{width: 350, height: 50, borderRadius: 2, fontSize: 17}}
                onClick={imalConnect.connectWithViteBridge}
                disabled={!imalConnect.getConnectionOptions().viteBridge}
                startIcon={<LinkIcon />}>
                Connect with Vite Wallet
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      </Modal>
      {/* This is the button that opens, too lazy to make two components communicate so here it is*/}
      {/* customizable text via connectText and connectedText props */}
      <IconButton
        onClick={handleModalOpen}
        color="#4caf50y"
        aria-label="Connect Wallet"
        sx={{marginLeft: 'auto', borderRadius: 3}}>
        <WalletRoundedIcon
          height="40"
          sx={{color: `${imalConnect.isConnected() === true ? '#52fa71' : 'text.sidebar'}`}}/>
        <Typography
          id="connectWalletText"
          variant="h5"
          noWrap
          component="div"
          sx={{
            marginLeft: 3,
            fontWeight: 600,
            color: `${imalConnect.isConnected() === true ? '#52fa71' : 'text.sidebar'}`,
            display: {md: 'flex', xs: 'none'}}}>
          {imalConnect.isConnected() === true ? props.connectedText : props.connectText}
        </Typography>
      </IconButton>
    </>

  );
}
ConnectModal.defaultProps = {
  connectText: 'Connect wallet',
  connectedText: 'Connected',
};
