import React from 'react';

interface PodcastContextObject {
  name: string;
  cuid: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setCuid: React.Dispatch<React.SetStateAction<string>>;
}

export interface PodcastontextParams {
  name: string;
  cuid: string;
}

// Create Context
const PodcastContext = React.createContext<PodcastContextObject>({
  name: '',
  cuid: '',
  setName: () => {},
  setCuid: () => {},
});

// Context Provider
export const PodcastContextProvider = PodcastContext.Provider;

export default PodcastContext;
