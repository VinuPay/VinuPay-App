import React, { useState, useEffect } from 'react';
import ItemDrawer from "../components/sidebar";
import MintMenu from "../components/MintMenu";
import * as imalConnect from "../imalConnect/index.js";

function MintTab() {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (imalConnect.isConnected()) {
            setConnected(true);
        }
        const connectEvent = () => setConnected(true);
        const disconnectEvent = () => setConnected(false);
        imalConnect.connectEvents.on("connect", connectEvent);
        imalConnect.connectEvents.on("disconnect", disconnectEvent);

        return () => {
            imalConnect.connectEvents.off("connect", connectEvent);
            imalConnect.connectEvents.off("disconnect", disconnectEvent);
        };
    }, []);

    return (
        <div>
            <ItemDrawer/>
            <h1>Mint a new VinuPay name 📡</h1>
            {connected ? <MintMenu/> : <h1>Connect your wallet to mint a new name!</h1>}
        </div>
    );
}

export default MintTab;
