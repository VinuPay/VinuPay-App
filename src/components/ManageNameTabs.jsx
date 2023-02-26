import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NamePanel from './NamePanel.jsx';
import {PayClient} from '../Onoffchain.js';
import * as imalConnect from '../imalConnect/index.js';
import LinearProgress from '@mui/material/LinearProgress';
import {useEffect} from 'react';
// I "borrowed" these three from react-material-ui tabs example
function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function ManageNameTabs(props) {
  // States
  const [value, setValue] = React.useState(0);
  const [namesArray, setNamesArray] = React.useState([]);
  const [statsLoaded, setStatsLoaded] = React.useState(false);
  const [connectedAddress, setConnectedAddress] = React.useState('');
  const [error, setError] = React.useState(false);
  useEffect(() => {
    // why use a function here? that's what react suggests to do
    async function run() {
      // Make the listener
      imalConnect.connectEvents.on('transactionSuccess', (tx) => {
        // Force reload this thing
        console.log('Transaction success!');
        run();
      });
      const connectedAddress = await imalConnect.getConnectedAddress();
      const p = performance.now();
      const names = await PayClient.getNamesByAddress(connectedAddress).catch((e) => {
        setError(e.message);
        setNamesArray([]);
        setStatsLoaded(false);
        console.log(e);
      });
      const q = performance.now();
      console.log(`Got names in ${q - p} ms`);

      // Look for the name in the names array
      if (props.nameId !== 0) {
        const a = performance.now();
        console.log(props.openTab);
        const name = names.findIndex((name) => name.name === props.openTab);
        console.log(name);
        if (name === -1) {
          setValue(0);
        } else {
          setValue(name);
        }
        const b = performance.now();
        console.log(`Found name in ${b - a} ms`);
      }


      if (error === false) {
        setConnectedAddress(connectedAddress);
        setNamesArray(names);
        setStatsLoaded(true);
      }
    }
    run();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Typography
        variant="h4"
        component="div"
        color="error"
        sx={{flexGrow: 1, textAlign: 'center'}}
        display={error === false ? 'none' : 'initial'}
      >
        An error occured: {error}
      </Typography>
      <Box sx={{width: '100%'}} component="div" display={statsLoaded === true && error === false ? 'initial' : 'none'}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            maxWidth: {xs: 320, sm: 480, md: 600, lg: 900},
            minWidth: {xs: 200, sm: 300, md: 400, lg: 800},
            margin: '0 auto',
          }}
          component="div"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              'justifyContent': 'center',
              '& .MuiTab-root': {
                maxWidth: 'none',
              },
            }}
          >
            {error === false ? namesArray.map((name, currentIndex) => (
              <Tab label={name.name + '.vinu'} {...a11yProps(currentIndex)} key={name.nameId} />
            )) : null}
          </Tabs>
        </Box>
        {error === false ? namesArray.map((name, currentIndex) => (
          <TabPanel value={value} index={currentIndex} key={name.nameId}>
            <NamePanel
              name={name.name}
              nameId={name.nameId}
              owner={connectedAddress}
              isVerified={name.isTrusted}
              key={name.nameId}
              canManage={true}
            />
          </TabPanel>
        )) : null}
      </Box>
      <Box sx={{width: '100%'}} display={statsLoaded === false && error === false ? 'initial' : 'none'}>
        <LinearProgress
          sx={{
            height: 7,
            borderRadius: 3,
            width: '30rem',
            maxWidth: '30%',
          }}
        />
      </Box>
    </>
  );
}
