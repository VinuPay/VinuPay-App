import React, {useState, useEffect} from 'react';
import StatsHandler from '../viteChain/statsHandler.js';
import ItemDrawer from '../components/sidebar.jsx';
import InfoBox from '../components/InfoBox.jsx';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

function MainTab() {
  const [currentHeight, setCurrentHeight] = useState('...');
  const [namesRegistered, setNamesRegistered] = useState('...');
  const [transactionsMade, setTransactionsMade] = useState('...');

  useEffect(() => {
    if (!StatsHandler.isSubscribed) {
      StatsHandler.subscribeToBlocks();
    }

    function eventHandler(stats) {
      setCurrentHeight(stats.height);
      setNamesRegistered(stats.namesRegistered);
      setTransactionsMade(stats.transactionsMade);
    }

    StatsHandler.statsEvents.on('statsUpdate', eventHandler);

    const stats = StatsHandler.getStats();
    if (stats.height !== 0) {
      setCurrentHeight(stats.height);
      setNamesRegistered(stats.namesRegistered);
      setTransactionsMade(stats.transactionsMade);
    }

    return () => {
      StatsHandler.statsEvents.off('statsUpdate', eventHandler);
    };
  }, []);

  return (
    <div>
      <ItemDrawer />
      <h1>Welcome to VinuPay! 👋 (0.75 - Fonts, duh!)</h1>
      <Container sx={{width: '100% !important', margin: '0 !important'}}>
        <Grid
          container
          spacing={3}
          columnSpacing={{xs: 1, sm: 1, md: 2, lg: 2, xl: 2}}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <InfoBox title="Names registered" value={namesRegistered} />
          </Grid>
          <Grid item>
            <InfoBox title="Transactions made" value={transactionsMade} />
          </Grid>
          <Grid item>
            <InfoBox title="Current height" value={currentHeight} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default MainTab;
