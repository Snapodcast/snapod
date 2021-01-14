import React from 'react';

interface PodcastContextObject {
  podcast: string;
  setPodcast: any;
}

// Create Context
const PodcastContext = React.createContext<PodcastContextObject>({
  podcast: '',
  setPodcast: () => {},
});

// Context Provider
export const PodcastContextProvider = PodcastContext.Provider;

export default PodcastContext;
