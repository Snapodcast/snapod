import React from 'react';

interface StorageContextObject {
  storageDir: string;
  setStorageDir: any;
}

// Create Context
const StorageContext = React.createContext<StorageContextObject>({
  storageDir: '',
  setStorageDir: () => {},
});

// Context Provider
export const StorageContextProvider = StorageContext.Provider;

export default StorageContext;
