import React from 'react';

// Create Context
const HeadContext = React.createContext<any>({});

// Context Provider
export const HeadContextProvider = HeadContext.Provider;

export default HeadContext;
