import React from 'react';

interface HeadContextObject {
  head: {
    title: string;
    description: string;
    savable?: boolean;
    doSave?: any;
  };
  setHead: any;
}

export interface HeadContextParams {
  title: string;
  description: string;
  savable?: boolean;
  doSave?: any;
}

// Create Context
const HeadContext = React.createContext<HeadContextObject>({
  head: {
    title: '',
    description: '',
    savable: false,
    doSave: () => {},
  },
  setHead: () => {},
});

// Context Provider
export const HeadContextProvider = HeadContext.Provider;

export default HeadContext;
