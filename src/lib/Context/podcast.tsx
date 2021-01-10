import React from 'react';

// Create Context
const PodcastContext = React.createContext<any>('');

// Context Provider
export const PodcastContextProvider = PodcastContext.Provider;

export default PodcastContext;
