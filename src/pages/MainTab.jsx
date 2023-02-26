import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ItemDrawer from '../components/sidebar.jsx';
import InfoBox from '../components/InfoBox.jsx';
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import * as React from 'react';
import StatsHandler from '../viteChain/statsHandler.js';
import Container from '@mui/material/Container';
class MainTab extends React.Component {
  constructor() {
    super();
    this.state = {currentHeight: '...', namesRegistered: '...', transactionsMade: '...'};
  }
  async componentDidMount() {
    if (!StatsHandler.isSubscribed) {
      StatsHandler.subscribeToBlocks();
    }
    StatsHandler.statsEvents.on('statsUpdate', this.eventHandler);
    const stats = StatsHandler.getStats();
    if (stats.height !== 0) {
      this.setState({
        currentHeight: stats.height,
        namesRegistered: stats.namesRegistered,
        transactionsMade: stats.transactionsMade});
    }
  }
  eventHandler = (stats) => {
    this.setState({
      currentHeight: stats.height,
      namesRegistered: stats.namesRegistered,
      transactionsMade: stats.transactionsMade});
  };
  async componentWillUnmount() {
    StatsHandler.statsEvents.off('statsUpdate', this.eventHandler);
  }
  render() {
    return (

      <div>

        <ItemDrawer/>
        <h1>Welcome to VinuPay! 👋 (0.6 - Themes update)</h1>
        <Container sx={{width: '100% !important', margin: '0 !important'}}>
          <Grid2
            container
            spacing={3}
            columnSpacing={{xs: 1, sm: 1, md: 2, lg: 2, xl: 2}}
            justifyContent="center"
            alignItems="center" >
            <Grid2 item>
              <InfoBox title="Names registered" value={this.state.namesRegistered}/>
            </Grid2>
            <Grid2 item>
              <InfoBox title="Transactions made" value={this.state.transactionsMade}/>
            </Grid2>
            <Grid2 item>
              <InfoBox title="Current height" value={this.state.currentHeight}/>
            </Grid2>
          </Grid2>
        </Container>
      </div>
    );
  }
}

export default MainTab;
