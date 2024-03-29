// noinspection JSValidateTypes

import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {PayClient} from '../../Onoffchain';
import * as imalConnect from '../../imalConnect/index.js';
import VerifiedRoundedIcon from '../../assets/verified.svg';
export default function NameSelector_CI(props) {
  // Get all user names and store them into a state
  const [userNames, setNames] = React.useState([]);
  const [selectedName, setSelectedName] = React.useState('');
  React.useEffect(() => {
    // Get names
    async function call() {
      try {
        const connectedAddress = await imalConnect.getConnectedAddress();
        const names = await PayClient.getNamesByAddress(connectedAddress);
        setNames(names);
      } catch (e) {
        alert('Error getting names: ' + e.message);
      }
    }
    call();
  }, []);
  const handleChange = (event) => {
    setSelectedName(event.target.value);
    if (event.target.value === '') {
      props.onNameSelect(false);
      return;
    }
    // Probably a better way to do this, but we will return the whole object which we will find in the userNames array
    const foundName = userNames.find((name) => name.name === event.target.value);
    props.onNameSelect(foundName);
  };
  return (
    <div>
      <h1>Name Selector</h1>
      <p>Select a name to use for this invoice</p>
      <FormControl sx={{m: 1, minWidth: 200}}>
        <InputLabel>VinuPay Name</InputLabel>
        <Select
          value={selectedName}
          onChange={handleChange}
          autoWidth
          label="VinuPay Name"
          MenuProps={{PaperProps: {sx: {maxHeight: 500}}}}
        >
          <MenuItem value="" key="none">
            <em>None</em>
          </MenuItem>
          {userNames.map((name) => {
            return (
              <MenuItem value={name.name} key={name.id}>
                <Grid container direction="row" alignItems="center">
                  <Typography variant="paragraph">
                    {name.name}.vinu
                  </Typography>
                  {name.isTrusted ? <VerifiedRoundedIcon style={{transform: 'scale(0.4)', marginLeft: -11}}/> : null}
                </Grid>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
