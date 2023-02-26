import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import TextField from '@mui/material/TextField';
import {isValidAddress, Calls} from '../Onoffchain.js';
import * as imalConnect from '../imalConnect/index.js';
import {Link} from '@mui/material';
export default function NamePanel(props) {
  const [addressValid, setAddressValid] = React.useState(true);
  const [transferAddress, setTransferAddress] = React.useState('');
  const [transferAddressHelperText, setTransferAddressHelperText] = React.useState(false);
  const verifyTransfer = (address) => {
    console.log(address);
    if (address.length === 0) {
      console.log('silentError');
      setTransferAddressHelperText('');
      setAddressValid(true); // Hide "error"
      return;
    }
    if (isValidAddress(address)) {
      setAddressValid(true);
      setTransferAddressHelperText('Looking great!');
      setTransferAddress(address);
    } else {
      setAddressValid(false);
      setTransferAddressHelperText('Invalid address');
      setTransferAddress(address);
    }
  };
  const transferName = async () => {
    const p = performance.now();
    // Get block
    const block = await Calls.transferName(props.nameId, transferAddress);
    const q = performance.now();
    console.log(`Generated transfer block in ${q - p} ms`);
    // Send block
    await imalConnect.sendAccountBlock(block);
  };
  // Panel for each name
  return (
    <Container component="div" maxWidth={'100%'}>
      <Box
        sx={{
          'maxWidth': '100%',
          'borderWidth': 15,
          'borderStyle': 'solid',
          'borderColor': 'background.paper',
          'boxShadow': 8,
          'borderRadius': 4,
          'backgroundColor': 'background.paper',
          '&:hover': {
            backgroundColor: 'background.paper',
            opacity: [0.98, 0.93, 0.9],
          },
        }}
      >
        <Box sx={{p: 3}}>
          <Typography variant="h3" fontWeight="800">Name Info 📜</Typography>
          <Typography variant="h4" fontWeight="900">{props.name}.vinu</Typography>
          <Typography variant="h5" align="left" sx={{fontWeight: 500, fontSize: 30}}>
            Owner:{' '}
            <Link
              href={`https://vitcscan.com/address/${props.owner}`}
              underline="none"
              rel="noopener"
              color="#52abff"
              target="_blank">
              {props.owner.slice(0, 11) + '...'}
            </Link>
          </Typography>
          <Typography variant="h5" align="left" sx={{fontWeight: 500, fontSize: 30}}>
            Name ID: {props.nameId}
          </Typography>
          <Typography variant="h5" align="left" sx={{fontWeight: 500, fontSize: 30}}>
            Trusted:{' '}
            {props.isVerified ? (
              <CheckRoundedIcon sx={{color: '#56ff00', stroke: '#56ff00', strokeWidth: 3}} />
            ) : (
              <CloseRoundedIcon sx={{color: '#f44336', stroke: '#f44336', strokeWidth: 3}} />
            )}
          </Typography>
        </Box>
        {props.canManage && (
          <>
            <Divider />
            <Box sx={{p: 3}}>
              <Typography variant="h3" fontWeight="800">Transfer 📨</Typography>
              <Typography variant="h5" align="center" sx={{fontWeight: 500, fontSize: 30, pt: 2}}>
                New owner
              </Typography>
              <TextField
                id="filled-basic"
                label="Vite Address"
                variant="filled"
                sx={{my: 2}}
                error={!addressValid}
                onChange={(event) => {
                  verifyTransfer(event.target.value);
                }}
              />
              <Typography
                variant="h6"
                component="div"
                display={transferAddressHelperText !== false ? 'block' : 'none'}
                color={addressValid ? '#1eff18' : '#ff0000'}
                sx={{mb: 2}}
              >
                {transferAddressHelperText}
              </Typography>
              <Typography variant="h5" align="center" sx={{fontWeight: 600, fontSize: 30, color: '#ff0000'}}>
                NOTE: This action is irreversible!
              </Typography>
              <Button
                variant="contained"
                color="error"
                sx={{mt: 2, minHeight: 50, minWidth: 120}}
                disabled={!addressValid}
                onClick={() => {
                  transferName();
                }}
              >
                Transfer
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>

  );
}
