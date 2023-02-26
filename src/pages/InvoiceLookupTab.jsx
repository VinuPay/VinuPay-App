import React from 'react';
import ItemDrawer from '../components/sidebar';
import InvoiceLookup from '../components/InvoiceLookup';
function InvoiceLookupTab() {
  return (
    <div>
      <ItemDrawer/>
      <h1>Lookup a VinuPay Invoice 🔎</h1>
      <InvoiceLookup/>
    </div>
  );
}

export default InvoiceLookupTab;
