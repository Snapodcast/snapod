import React from 'react';

// Create Context
const StorageContext = React.createContext<any>({});

// Context Provider
export const StorageContextProvider = StorageContext.Provider;

export default StorageContext;
