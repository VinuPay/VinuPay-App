import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Confetti from 'react-dom-confetti';
import BigNumber from 'bignumber.js';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {PayClient} from '../Onoffchain.js';
import * as imalConnect from '../imalConnect/index.js';
import {Calls} from '../Onoffchain.js';
import {connectEvents} from '../imalConnect/index.js';

const confettiConfig = {
  angle: 90,
  spread: '130',
  startVelocity: 40,
  elementCount: '200',
  dragFriction: '0.11',
  duration: '2000',
  stagger: 1,
  width: '20px',
  height: '15px',
  perspective: '900px',
  colors: ['#007aff', '#29cdff', '#6737ff', '#ff5454', '#fdff6a'],
};

export default class MintMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      isValid: true,
      reason: '',
      reasonId: undefined,
      price: 0,
      fiatPrice: 0,
      contractInfo: null,
      tokenPrice: '0',
      confetti: false,
      shouldLoad: false,
    };
  }

  async componentDidMount() {
    const vinuPrice = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=vita-inu&vs_currencies=usd',
        {headers: {'Content-Type': 'application/json'}})
        .then((res) => res.json()).then((result) => result['vita-inu']['usd']);

    const cInfo = await PayClient.getContractInfo();
    this.setState({contractInfo: cInfo, tokenPrice: vinuPrice});
  }
  waitForMint = () => {
    this.setState({shouldLoad: true});
    connectEvents.on('transactionSuccess', () => {
      this.setState({confetti: true, shouldLoad: false});
      setTimeout(() => {
        this.setState({confetti: false});
      }, 3500);
    });
  };
  checkName = async (name) => {
    this.setState({shouldLoad: true});
    // Check regex
    console.log(name);
    if (name.length === 0) {
      this.setState({isValid: true, reason: '', reasonId: undefined, price: 0, shouldLoad: false, name: ''});
      return;
    }
    if (name.length < 3) {
      this.setState({
        isValid: false,
        reason: 'Name must be at least 3 characters long',
        reasonId: 1,
        price: 'N/A',
        fiatPrice: 'N/A',
        shouldLoad: false});
      return false;
    } else if (name.length > 24) {
      this.setState({
        isValid: false,
        reason: 'Name must be at most 24 characters long',
        reasonId: 1,
        price: 'N/A',
        fiatPrice: 'N/A',
        shouldLoad: false});
      return false;
    } else {
      this.setState({reasonId: 0, shouldLoad: false});
    }
    const nameMatchRegex = PayClient.checkNameRegex(name);
    if (!nameMatchRegex) {
      this.setState({
        isValid: false,
        reason: 'Invalid characters in name.',
        reasonId: 2,
        price: 'N/A',
        fiatPrice: 'N/A',
        shouldLoad: false});
      return false;
    }
    const nameTaken = await PayClient.isNameTaken(name);
    if (nameTaken) {
      this.setState({
        isValid: false,
        reason: 'Name is already taken.',
        reasonId: 3,
        price: 'N/A',
        fiatPrice: 'N/A',
        shouldLoad: false});
      return false;
    }
    if (this.state.reasonId === 1) {
      return false;
    } else {
      this.setState({isValid: true, reason: ''});
    }
    // price estimation yay
    if (name.length === 3) {
      const price = new BigNumber(this.state.contractInfo.veryShortMultiplier)
          .multipliedBy(this.state.contractInfo.baseFee)
          .shiftedBy(-18)
          .toFixed();
      const fiatPrice = new BigNumber(this.state.tokenPrice)
          .multipliedBy(price)
          .toFixed();
      this.setState({price: price, fiatPrice: fiatPrice, name: name, shouldLoad: false});
    } else if (name.length === 4) {
      const price = new BigNumber(this.state.contractInfo.shortMultiplier)
          .multipliedBy(this.state.contractInfo.baseFee)
          .shiftedBy(-18)
          .toFixed();
      const fiatPrice = new BigNumber(this.state.tokenPrice)
          .multipliedBy(price)
          .toFixed();
      this.setState({price: price, fiatPrice: fiatPrice, name: name, shouldLoad: false});
    } else if (name.length > 4 && name.length <= 24) {
      const price = new BigNumber(this.state.contractInfo.baseFee)
          .shiftedBy(-18)
          .toFixed();
      const fiatPrice = new BigNumber(this.state.tokenPrice)
          .multipliedBy(price)
          .toFixed();
      this.setState({price: price, fiatPrice: fiatPrice, name: name, shouldLoad: false});
    }
  };
  render() {
    return (
      <Container>
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
          <Typography variant="h4" sx={{fontWeight: 700}}>Enter the name you&apos;d like to mint 📝</Typography>

          <FormControl sx={{m: 2, width: '26ch'}} variant="outlined">
            <OutlinedInput
              id="filled-basic"
              type="text"
              label="VinuPay Name"
              variant="filled"
              sx={{marginBottom: 2}}
              error={!this.state.isValid}
              onChange={(event) => {
                this.checkName(event.target.value).then((result) => {});
              }} endAdornment={<InputAdornment position="end">.vinu</InputAdornment>}/>
            <InputLabel htmlFor="filled-adornment-amount">VinuPay Name</InputLabel>
            <Typography
              variant="h6"
              display={this.state.reasonId === undefined ? 'none' : 'block'}
              color={this.state.isValid ? '#1eff18' : '#ff0000'}>
              {this.state.isValid ? 'Looking good!' : this.state.reason}
            </Typography>
          </FormControl>

          <Typography variant="h4" sx={{fontWeight: 700}}>Price:
            <Typography
              display="inline"
              variant="h4"
              sx={{fontWeight: 800, color: '#006aff'}}>
              {this.state.price}
            </Typography>
                            VINU (
            <Typography
              display="inline"
              variant="h4"
              sx={{fontWeight: 800, color: '#1eff18'}}>
              ~ ${this.state.fiatPrice}
            </Typography>
                            )
          </Typography>
          {/* Confetti */}
          <Box display="flex" justifyContent="center" alignItems="center">
            <Confetti active={this.state.confetti} config={confettiConfig}/>
          </Box>
          <LoadingButton
            onClick={() => {
              Calls.mintName(this.state.name, new BigNumber(this.state.price).shiftedBy(18).toFixed()).then((block) => {
                imalConnect.sendAccountBlock(block).catch((e) => {
                  alert(e.message); this.setState({shouldLoad: false});
                });
              }); this.waitForMint();
            }}
            endIcon={<AutoFixHighIcon />}
            loading={this.state.shouldLoad}
            loadingPosition="end"
            variant="contained"
            color="secondary" sx={{minHeight: 50, minWidth: 120, marginTop: 3}}
            disabled={!this.state.isValid || this.state.name === ''}
          >
                            Mint
          </LoadingButton>
          <Typography
            variant="h3"
            sx={{fontWeight: 800, marginTop: 15}}>
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

    );
  }
}
