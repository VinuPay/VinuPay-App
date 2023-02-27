import React, {useState, useEffect} from 'react';
import ItemDrawer from '../components/sidebar';
import ManageNameTabs from '../components/ManageNameTabs.jsx';
import * as imalConnect from '../imalConnect/index.js';

const ManageTab = (props) => {
  const [connected, setConnected] = useState(false);
  const [openNo, setOpenNo] = useState(0);

  const disconnectEvent = () => {
    setConnected(false);
  };

  const connectEvent = () => {
    setConnected(true);
  };

  useEffect(() => {
    const hash = new URL(document.URL).hash.substring(1);
    if (hash !== '') {
      setOpenNo(hash);
    }
    // Await connection
    if (imalConnect.isConnected()) {
      setConnected(true);
    }
    imalConnect.connectEvents.on('connect', connectEvent);
    imalConnect.connectEvents.on('disconnect', disconnectEvent);

    return () => {
      imalConnect.connectEvents.off('connect', connectEvent);
      imalConnect.connectEvents.off('disconnect', disconnectEvent);
    };
  }, []);

  return (
    <div>
      <ItemDrawer />
      <h1>Manage Names 📝</h1>
      {connected ? (
        <ManageNameTabs openTab={openNo} />
      ) : (
        <h1>Connect your wallet to manage your names!</h1>
      )}
    </div>
  );
};

export default ManageTab;
