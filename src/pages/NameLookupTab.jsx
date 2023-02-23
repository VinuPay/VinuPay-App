import React from 'react';
import ItemDrawer from '../components/sidebar';
import NameLookup from '../components/NameLookup';

function NameLookupTab() {
  return (
    <div>
      <ItemDrawer/>
      <h1>Lookup a VinuPay name 🔎</h1>
      <NameLookup/>
    </div>
  );
}

export default NameLookupTab;
