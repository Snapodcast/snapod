declare interface Podcast {
  dir: string;
  logo: string;
  name: string;
  description: string;
  author: string;
  cate: string;
  type: string | 'episodic' | 'serial';
  advisory: string | 'clean' | 'explicit';
  lang: string;
  url: string;
  owner: {
    name: string;
    email: string;
  };
}

declare interface PodcastFull extends Podcast {
  id: string;
}

declare interface PodcastUpdated extends PodcastFull {
  originalName: string;
}

declare interface MainData {
  podcasts?: PodcastFull[];
}

declare module 'react-wavy-audio';
declare module 'mp3-duration';
declare module '@wojtekmaj/react-daterange-picker';
declare module 'rc-animate';

declare interface StatsIntervalResult {
  name: number;
  plays: number;
  countries: {
    [name: string]: {
      plays: number;
      cities: {
        [name: string]: number;
      };
    };
  };
  devices: { [name: string]: number };
  clients: { [name: string]: number };
}
