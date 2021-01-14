import React from 'react';

interface HeadContextObject {
  head: {
    title: string;
    description: string;
  };
  setHead: any;
}

// Create Context
const HeadContext = React.createContext<HeadContextObject>({
  head: {
    title: '',
    description: '',
  },
  setHead: () => {},
});

// Context Provider
export const HeadContextProvider = HeadContext.Provider;

export default HeadContext;
