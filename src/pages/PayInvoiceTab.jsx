import React from 'react';
import ItemDrawer from '../components/sidebar';
import PayInvoice from '../components/PayInvoice';
function PayInvoiceTab() {
  return (
    <div>
      <ItemDrawer/>
      <h1>Pay a VinuPay Invoice 🔎</h1>
      <PayInvoice/>
    </div>
  );
}

export default PayInvoiceTab;
