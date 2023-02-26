import React from 'react';
import {getCookie, themeChange} from '../index';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import themes from '../themes.jsx';
export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = React.useState(getCookie('theme'));
  const [themesList, setThemesList] = React.useState([]);
  const handleThemeChange = (event) => {
    setCurrentTheme(event.target.value);
    themeChange.emit('themeChange', event.target.value);
  };
  React.useEffect(() => {
    if (!getCookie('theme')) {
      setCurrentTheme('Nox');
    } else {
      setCurrentTheme(getCookie('theme'));
    }
    setThemesList(themes);
  }, []);
  return (
    <>
      <Container sx={{flexGrow: 1}} />
      <FormControl sx={{maxWidth: '400px', margin: '0 auto 16px auto', width: '80%'}}>
        <InputLabel>Theme</InputLabel>
        <Select
          value={currentTheme}
          label="Theme"
          onChange={handleThemeChange}
        >
          {themesList.map((theme) => {
            // eslint-disable-next-line react/jsx-key
            return <MenuItem value={theme.name}>{theme.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </>

  );
}

