import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
import {PayClient} from '../Onoffchain.js';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NamePanel from './NamePanel';

export default function NameLookup() {
  const [name, setName] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);
  const [reason, setReason] = React.useState('');
  const [reasonId, setReasonId] = React.useState(undefined);
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const [nameData, setNameData] = React.useState(null);
  function checkNameValidity(name) {
    // setShouldLoad(true);
    // Check just for length and regex
    const result = PayClient.checkNameRegex(name);
    if (!result) {
      console.log('efff');
      setIsValid(false);
      setReasonId(1);
      // setShouldLoad(false);
      return false;
    } else {
      console.log('e');
      setName(name);
      setIsValid(true);
      setReason('');
      setReasonId(undefined);
      // setShouldLoad(false);
      return true;
    }
  }
  async function lookupName() {
    console.log('wtf');
    setShouldLoad(true);
    try {
      console.log(shouldLoad);
      if (checkNameValidity(name)) {
        const pn = performance.now();
        const nameInfo = await PayClient.getName(name);
        console.log(performance.now() - pn);
        if (nameInfo.ownerAddress === 'vite_0000000000000000000000000000000000000000a4f3a0cb58') {
          setIsValid(false);
          setReasonId(2);
          setReason('This name is not registered');
          setNameData(null);
          setShouldLoad(false);
          return false;
        } else {
          setShouldLoad(false);
          setNameData(nameInfo);
        }
      }
    } catch (e) {
      console.log(e);
      // setIsValid(false);
      setReasonId(2);
      // setShouldLoad(false);
      setReason(e.message);
    }
  }
  return (
    <div>
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
          <Typography variant="h4" sx={{fontWeight: 700}}>Enter the name you&apos;d like to look up 📝</Typography>

          <FormControl sx={{m: 2, width: '26ch'}} variant="outlined">
            <OutlinedInput
              id="filled-basic"
              type="text"
              label="VinuPay Name"
              variant="filled"
              sx={{marginBottom: 2}}
              error={!isValid}
              onChange={(event) => {
                checkNameValidity(event.target.value);
              }} endAdornment={<InputAdornment position="end">.vinu</InputAdornment>}/>
            <InputLabel htmlFor="filled-adornment-amount">VinuPay Name</InputLabel>
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
              lookupName();
            }}
            endIcon={<SearchRoundedIcon />}
            loading={shouldLoad}
            loadingPosition="end"
            variant="contained"
            color="secondary" sx={{minHeight: 50, minWidth: 120}}
            disabled={!isValid || name === ''}
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
              sx={{fontWeight: 800, color: 'background.primary'}}>
              Pay 🎉
            </Typography>
          </Typography>
          <Typography
            variant="h5"
            sx={{fontWeight: 700, mt: 5}}
            color="error">
            NOTICE: The displaying of the result of the lookup will most likely be changed in future versions.
          </Typography>
        </Box>

      </Container>

      {/* Name "output" panel */}
      <Container sx={{paddingTop: 3}}>
        {nameData !== null?
          <NamePanel
            name={nameData.name}
            nameId={nameData.nameId}
            owner={nameData.ownerAddress}
            isVerified={name.isTrusted}
            canManage={false}
            style={{paddingTop: 5}}/> : ''}
      </Container>
    </div>
  );
}
