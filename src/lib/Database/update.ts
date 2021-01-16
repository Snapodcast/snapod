import storage from 'electron-json-storage';
import updateMain from './updateMain';

export default async function podcastUpdate(params: PodcastFull) {
  const processData = async (): Promise<{ status: boolean; msg: string }> => {
    return new Promise((resolve) => {
      // Set current data path
      storage.setDataPath(params.dir);

      // Determine if the podcast exists
      storage.has(`snapod_podcast_data_${params.id}`, (error1, hasKey) => {
        if (error1)
          resolve({
            status: false,
            msg: `An internal error has occurred`,
          });

        if (!hasKey) {
          resolve({
            status: false,
            msg: 'Podcast does not exist, no change has been made',
          });
        } else {
          // Update podcast
          storage.set(
            `snapod_podcast_data_${params.id}`,
            params,
            async (error2) => {
              if (error2)
                resolve({
                  status: false,
                  msg: `An internal error has occurred`,
                });

              // Update main data file
              const status = await updateMain(params);
              if (status) {
                resolve({
                  status: true,
                  msg: `${params.name} has been updated`,
                });
              } else {
                resolve({
                  status: false,
                  msg: `An internal error has occurred`,
                });
              }
            }
          );
        }
      });
    });
  };
  return processData();
}
