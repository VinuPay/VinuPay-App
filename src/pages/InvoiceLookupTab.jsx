import React from 'react';
import ItemDrawer from '../components/sidebar';
import InvoiceLookup from '../components/InvoiceLookup';
import InvoicePanel from '../components/InvoicePanel';
function InvoiceLookupTab() {
  return (
    <div>
      <ItemDrawer/>
      <h1>Lookup a VinuPay Invoice 🔎</h1>
      <InvoiceLookup/>
      <InvoicePanel txId="11"></InvoicePanel>
    </div>
  );
}

export default InvoiceLookupTab;
