import storage from 'electron-json-storage';
import electron from 'electron';

const modifyIfExists = (
  podcasts: PodcastFull[],
  targetPodcast: PodcastFull
): Podcast[] => {
  const data = podcasts;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].id === targetPodcast.id) {
      data[i] = targetPodcast;
      return data;
    }
  }
  return data.concat(targetPodcast);
};

export default async function updateMain(params: PodcastFull) {
  const processData = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Set current data path
      storage.setDataPath(
        (electron.app || electron.remote.app).getPath('userData')
      );

      // Determine if main data file exist
      storage.has(`snapod_main_data`, (error1, hasKey) => {
        if (error1) resolve(false);

        // Create main data file
        if (!hasKey) {
          storage.set(`snapod_main_data`, { podcasts: [params] }, (error2) => {
            if (error2) resolve(false);
            resolve(true);
          });
        } else {
          // Get current main data file
          storage.get('snapod_main_data', (error3, data: MainData) => {
            if (error3 || !data.podcasts) {
              resolve(false);
            } else {
              // Update if a Podcast exists, add it otherwise
              storage.set(
                `snapod_main_data`,
                { podcasts: modifyIfExists(data.podcasts, params) },
                (error4) => {
                  if (error4) resolve(false);
                  resolve(true);
                }
              );
            }
          });
        }
      });
    });
  };
  return processData();
}
