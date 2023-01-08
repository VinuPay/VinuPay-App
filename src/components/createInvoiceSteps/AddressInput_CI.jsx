// noinspection JSValidateTypes

import React from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {isValidAddress} from 'web3-vite/dist/utils'
import * as imalConnect from "../../imalConnect/index.js";
export default function AddressInput_CI(props) {
    // Get all user names and store them into a state
    const [selectedAddress, setSelectedAddress] = React.useState('');
    const [isAddressValid, setIsAddressValid] = React.useState(true);
    const [silentLock, setSilentLock] = React.useState(false);
    const checkAddress = (event) => {
        setSelectedAddress(event.target.value);
        if (event.target.value === '') {
            setIsAddressValid(true);
            props.onAddressInput('');
            return;
        }
        if (isValidAddress(event.target.value)) {
            setIsAddressValid(true);
            props.onAddressInput(event.target.value);
            return true;
        } else {
            props.onAddressInput(false);
            setIsAddressValid(false);
            return false;
        }
    }
    const setConnectedWallet = async () => {
        setSilentLock(true);
        let address = await imalConnect.getConnectedAddress();
        if (address) {
            setSelectedAddress(address);
            setIsAddressValid(true);
            props.onAddressInput(address);
        }
        setSilentLock(false);
    }
    return (
        <div>
            <h1>Address Input</h1>
            <p>Enter the destination address where the funds will be sent after this invoice is paid.</p>
            <TextField id="filled-basic" label="Vite Address" variant="filled" onChange={checkAddress} error={!isAddressValid} value={selectedAddress} helperText={!isAddressValid ? 'This address is invalid' : null}/>
            <br/>
            <Button variant="contained" sx={{minHeight: 25, mt: 3}} onClick={setConnectedWallet}>My Vite Address (Connected Wallet)</Button>
        </div>
    )

}