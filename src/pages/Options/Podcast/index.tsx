import React from 'react';
import StorageContext from '../../../lib/Context/storage';

export default function Podcast() {
  const { storageDir } = React.useContext(StorageContext);
  return (
    <div>
      <p>podcast</p>
      <p>Storage Directory: {storageDir}</p>
    </div>
  );
}
