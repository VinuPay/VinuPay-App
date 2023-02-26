import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import InvoicePanel from './InvoicePanel';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
const styles = {
  'dialogPaper': {
    overflow: 'hidden',
    maxWidth: '90%',
    width: 'auto',
    margin: 'auto',
  },
  '@media (min-width: 768px)': {
    dialogPaper: {
      maxWidth: '70%',
    },
  },
  '@media (min-width: 1024px)': {
    dialogPaper: {
      maxWidth: '50%',
    },
  },
};

export default function InvoiceModal(props) {
  const [open, setOpen] = React.useState(false);
  const [invoiceId, setInvoiceId] = React.useState(undefined);
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
      <Dialog
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: styles.dialogPaper,
        }}
      >
        <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          VinuPay Invoice
          <IconButton onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <Box>
          <InvoicePanel txId={invoiceId}></InvoicePanel>
        </Box>
      </Dialog>
    </div>
  );
}
