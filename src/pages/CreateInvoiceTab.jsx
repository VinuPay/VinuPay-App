import React, {useState, useEffect} from 'react';
import ItemDrawer from '../components/sidebar';
import CreateInvoice from '../components/CreateInvoice';
import * as imalConnect from '../imalConnect/index.js';

export default function CreateInvoiceTab() {
  const [connected, setConnected] = useState(true);

  const disconnectEvent = () => {
    setConnected(false);
  };

  const connectEvent = () => {
    setConnected(true);
  };

  useEffect(() => {
    if (imalConnect.isConnected()) {
      setConnected(true);
    }
    imalConnect.connectEvents.on('connect', connectEvent);
    imalConnect.connectEvents.on('disconnect', disconnectEvent);

    return () => {
      // Clean up the event handlers when the component unmounts
      imalConnect.connectEvents.off('connect', connectEvent);
      imalConnect.connectEvents.off('disconnect', disconnectEvent);
    };
  }, []); // The empty array ensures that the effect only runs once, when the component mounts

  return (
    <div>
      <ItemDrawer />
      <h1>Create a new VinuPay invoice 📡</h1>
      {connected ? <CreateInvoice/> : <h1>Connect your wallet to create a new invoice!</h1>}
    </div>
  );
};
