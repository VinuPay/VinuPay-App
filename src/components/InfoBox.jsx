import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Used for the index tab (stats)
const InfoBox = (props) => {
  return (
    <Box
      sx={{
        'display': 'flex',
        'backgroundColor': 'background.paper',
        'boxShadow': 3,
        'overflow': 'hidden',
        'height': 120,
        'borderRadius': 1.5,
        '&:hover': {
          backgroundColor: 'background.paper',
          opacity: [0.9, 0.87, 0.86],
        },
      }}
    >
      <Typography
        align="left"
        variant="h5"
        sx={{
          paddingLeft: 2,
          paddingTop: 1,
          paddingRight: 1.3,
          flexGrow: 1,
          fontSize: 27,
          fontWeight: 700,
          fontColor: 'white',
        }}
      >
        {props.title}
      </Typography>
      <Typography
        align="right"
        variant="h3"
        color='background.primary'
        sx={{
          paddingTop: 1,
          paddingRight: 1.3,
          flexGrow: 1,
          fontWeight: 600,
          fontSize: 33,
        }}
      >
        {props.value}
      </Typography>
    </Box>
  );
};

export default InfoBox;
