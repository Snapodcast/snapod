import React from 'react';
import StorageContext from '../../../lib/Context/storage';

export default function Hosting() {
  const { storageDir } = React.useContext(StorageContext);
  return (
    <div>
      <p>hosting</p>
      <p>Storage Directory: {storageDir}</p>
    </div>
  );
}
