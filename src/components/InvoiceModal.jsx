import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import InvoicePanel from './InvoicePanel';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 3,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
};

export default function InvoiceModal(props) {
  const [open, setOpen] = React.useState(false);
  const [invoiceId, setInvoiceId] = React.useState(undefined);
  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
    props.onClose();
  };
  React.useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
  }, [props.open]);
  React.useEffect(() => {
    if (props.invoiceId) {
      setInvoiceId(props.invoiceId);
    }
  }, [props.invoiceId]);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{backdrop: Backdrop}}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <IconButton
              sx={{
                position: 'absolute',
                left: '95%', top: '-3%',
                backgroundColor: 'background.primary',
                color: 'white'}}>
              <CloseRoundedIcon sx={{ml: 'auto'}} onClick={handleClose}></CloseRoundedIcon>
            </IconButton>
            <InvoicePanel txId={invoiceId}></InvoicePanel>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
