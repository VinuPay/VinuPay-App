import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function createData(name, value) {
  return {name, value};
}

export default function ConfirmAndSend_CI(props) {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    console.log(props);
    // Name
    const nameRow = createData('Name', props.name.name + '.vinu');
    // Address
    const addressRow = createData('Address', props.address.substring(0, 11) + '...');
    // Token & Amount
    const invoiceValueRow = createData('Amount', `${props.amount} ${props.token.label}`);
    // Expiration time
    const expirationTimeRow = createData('Expiration time', props.expirationTime.format('YYYY-MM-DD HH:mm:ss'));
    // Put all rows into a state
    setRows([nameRow, addressRow, invoiceValueRow, expirationTimeRow]);
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Option</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
