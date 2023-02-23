import React from 'react';
import ItemDrawer from '../components/sidebar';
import Tab from '../components/TabClass.jsx';
import ManageNameTabs from '../components/ManageNameTabs.jsx';
import * as imalConnect from '../imalConnect/index.js';
export default class ManageTab extends Tab {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      openNo: 0,
    };
  }
  disconnectEvent = () => {
    this.setState({connected: false});
  };
  connectEvent = () => {
    this.setState({connected: true});
  };
  async componentDidMount() {
    const hash = new URL(document.URL).hash.substring(1);
    if (hash !== '') {
      this.setState({openNo: hash});
    }
    // Await connection
    if (imalConnect.isConnected()) {
      this.setState({connected: true});
    }
    imalConnect.connectEvents.on('connect', this.connectEvent);
    imalConnect.connectEvents.on('disconnect', this.disconnectEvent);
  }
  render() {
    return (
      <div>
        <ItemDrawer/> <h1>Manage Names 📝</h1>
        {imalConnect.isConnected() ?
          <ManageNameTabs openTab={this.state.openNo}/> :
          <h1>Connect your wallet to manage your names!</h1>}
      </div>
    );
  }
}
