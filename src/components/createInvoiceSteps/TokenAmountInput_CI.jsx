// noinspection JSValidateTypes

import React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import {ViteClient} from '../../Onoffchain.js';
import InputAdornment from '@mui/material/InputAdornment';
import {getTokenIcon} from '../../viteChain/cryptoInfo';
export default function TokenAmountInput_CI(props) {
  const [tokenList, setTokenList] = React.useState([]);
  const [token, setToken] = React.useState(null);
  const [value, setValue] = React.useState(0);
  const [tokenIcon, setTokenIcon] = React.useState(null);
  // Get all user names and store them into a state
  React.useEffect(() => {
    async function run() {
      // Get first 1000 tokens
      const tempList = [];
      let tokens = await ViteClient.request('mintage_getTokenInfoList', [0, 1000]);
      // Format
      for (const token of tokens.tokenInfoList) {
        if (token.tokenId === 'tti_5649544520544f4b454e6e40') {
          tempList.push({
            id: token.tokenId,
            label: 'VITE',
            symbol: 'VITE',
            decimals: 18,
          });
          setToken({
            id: token.tokenId,
            label: 'VITE',
            symbol: 'VITE',
            decimals: 18,
          });
        } else {
          tempList.push({
            id: token.tokenId,
            label: `${token.tokenName} (${token.tokenSymbol}-${token.index})`,
            symbol: `${token.tokenSymbol}-${token.index}`,
            decimals: token.decimals,
          });
        }
      }
      // Get next 1000 tokens
      tokens = await ViteClient.request('mintage_getTokenInfoList', [1, 1000]);
      for (const token of tokens.tokenInfoList) {
        if (token.tokenId === 'tti_5649544520544f4b454e6e40') {
          tempList.push({
            id: token.tokenId,
            label: 'VITE',
            symbol: 'VITE',
            decimals: 18,
          });
          setToken({
            id: token.tokenId,
            label: 'VITE',
            symbol: 'VITE',
            decimals: 18,
          });
        } else {
          tempList.push({
            id: token.tokenId,
            label: `${token.tokenName} (${token.tokenSymbol}-${token.index})`,
            symbol: `${token.tokenSymbol}-${token.index}`,
            decimals: token.decimals,
          });
        }
      }
      // Save
      setTokenList(tempList);
    }
    run();
  }, []);
  // I assume it's not suprsising that I'm using a controlled component

  const handleAmountChange = async (event) => {
    // Check if only numbers and decimals
    if (event.target.value.match(/^[0-9]+(\.[0-9]+)?$/) ||
      event.target.value === '' ||
      event.target.value.endsWith('.')) {
      await setValue(event.target.value);
      sendToStepper(false, event.target.value);
    } else {
      sendToStepper(true);
    }
  };
  const tokenSelected = async (event, value) => {
    await setToken(value);
    sendToStepper(false, undefined, value);
  };
  // Don't complain about this, it doesn't work otherwise
  const sendToStepper = (shouldDeny, amt, tok) => {
    if (amt === undefined) {
      amt = value;
    }
    if (tok === undefined) {
      tok = token;
    }
    // Stupid JavaScript or me since when is 191. a valid number?
    if (amt === 0 ||
      tok === false ||
      isNaN(amt) ||
      amt.endsWith('.') ||
      shouldDeny ||
      amt === '' ||
      parseFloat(amt) === 0) {
      console.log('Denying');
      props.onValueInput(false);
    } else {
      props.onValueInput({
        amount: amt,
        token: tok,
      });
    }

    if (tok === null) {
      setTokenIcon(null);
    } else {
      setIconUrl(tok.id);
    }
  };
  const setIconUrl = async (tokenId) => {
    try {
      const iconUrl = await getTokenIcon(tokenId);
      setTokenIcon(iconUrl);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{display: 'block', justifyContent: 'center', alignItems: 'center'}}>
      <h1>Token and amount</h1>
      <p>Select a token and enter the amount to be used for this invoice.</p>
      {/* Token selection */}
      <Grid style={{display: 'inline-block', textAlign: 'left'}}>
        <Grid item>

          <Grid container>
            <Grid item sx={{minWidth: 300}}>
              <Autocomplete
                disablePortal
                options={tokenList}
                sx={{minWidth: 300, maxWidth: 400, display: 'inline'}}
                onChange={tokenSelected}
                renderInput={(params) => <TextField {...params} label="Token" sx={{maxWidth: 350}}/>}
              />
            </Grid>
            <Grid item>
              {tokenIcon !== null ?
                                    <img
                                      style={{width: 50, height: 50, display: 'inline', marginLeft: 10}}
                                      src={tokenIcon}
                                      alt={tokenIcon}
                                    /> :
                                    null
              }

            </Grid>

          </Grid>

        </Grid>
        <Grid item>
          {/* Amount input */}
          <FormControl sx={{minWidth: 300, maxWidth: 150, marginTop: 2}} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-weight">Amount</InputLabel>
            <OutlinedInput
              label="Amount"
              onChange={handleAmountChange}
              value={value}
              id="outlined-adornment-weight"
              endAdornment={<InputAdornment position="end">{token ? token.symbol : 'VITE'}</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
            />
          </FormControl>
        </Grid>

      </Grid>
    </div>
  );
}
