import storage from 'electron-json-storage';
import md5 from 'md5';
import updateMain from './updateMain';

export default async function podcastCreate(params: Podcast) {
  const processData = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Set current data path
      storage.setDataPath(params.dir);

      // Determine if podcast already exists
      storage.has(
        `snapod_podcast_data_${md5(params.name)}`,
        (error1, hasKey) => {
          if (error1) reject(error1);

          // Create data file
          if (!hasKey) {
            storage.set(
              `snapod_podcast_data_${md5(params.name)}`,
              params,
              async (error2) => {
                if (error2) reject(error2);

                // Update main data file
                await updateMain(params);
                resolve({
                  status: true,
                  msg: `${params.name} has been created and added to your podcast list`,
                });
              }
            );
          } else {
            resolve({
              status: false,
              msg: 'Podcast already exists, no change has been made',
            });
          }
        }
      );
    });
  };
  const statusJson = await processData();
  return statusJson;
}
