import useSWR, { mutate } from 'swr';
import storage from 'electron-json-storage';

export const refetchPodcast = (podcastName: string) => {
  mutate(podcastName);
};

const getData = async (params: string): Promise<PodcastFull> => {
  const paramsJson: {
    podcastId: string;
    storageDir: string;
  } = JSON.parse(params);
  const { podcastId } = paramsJson;
  const { storageDir } = paramsJson;
  return new Promise((resolve, reject) => {
    // Set current data path
    storage.setDataPath(storageDir);
    storage.get(`snapod_podcast_data_${podcastId}`, (err, data: any) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const usePodcast = (podcastId: string, storageDir: string) => {
  const { data, error } = useSWR(
    JSON.stringify({
      podcastId,
      storageDir,
    }),
    getData
  );
  return {
    podcastData:
      data === undefined || data.name === undefined ? undefined : data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default usePodcast;
