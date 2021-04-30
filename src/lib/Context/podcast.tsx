import React from 'react';

interface PodcastContextObject {
  podcast: {
    cuid: string;
    name: string;
    description: string;
  };
  setPodcast: any;
}

// Create Context
const PodcastContext = React.createContext<PodcastContextObject>({
  podcast: {
    cuid: '',
    name: '',
    description: '',
  },
  setPodcast: () => {},
});

// Context Provider
export const PodcastContextProvider = PodcastContext.Provider;

export default PodcastContext;
