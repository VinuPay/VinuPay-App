// noinspection JSValidateTypes

import React from 'react';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
export default function TimeSelector_CI(props) {
  // Get all user names and store them into a state
  const [time, setTime] = React.useState(dayjs().add(1, 'day').startOf('day'));
  const handleTimeChange = (newValue) => {
    // Check if valid
    if (newValue.isBefore(dayjs().add(7, 'days'))) {
      props.onTimeInput(newValue);
    } else {
      props.onTimeInput(false);
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* ^ Using User's local time, will convert to utc later to get snapshot block ^ */}
      <h1>Choose expiration time</h1>
      <p>When should this invoice expire?</p>
      <DateTimePicker
        label="Date&Time picker"
        value={time}
        onChange={(newValue) => {
          setTime(newValue); handleTimeChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
        maxDateTime={dayjs().add(6, 'days').add(23, 'hours').add(59, 'minutes')} // For safety
        minDateTime={dayjs().add(1, 'minute')}
      />
    </LocalizationProvider>
  );
}
