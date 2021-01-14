import useSWR, { mutate } from 'swr';
import storage from 'electron-json-storage';
import rootPath from '../../utilities/path';

export const refetchPodcasts = () => {
  mutate('podcasts');
};

const getData = async (): Promise<Podcast[]> => {
  return new Promise((resolve, reject) => {
    // Set current data path
    storage.setDataPath(rootPath());
    storage.get('snapod_main_data', (err, data: MainData) => {
      if (err) reject(err);
      resolve(data.podcasts);
    });
  });
};

const fetchPodcasts = async () => {
  const data = await getData();
  return data;
};

const usePodcasts = () => {
  const { data, error } = useSWR('podcasts', fetchPodcasts);
  return {
    podcastsData: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default usePodcasts;
