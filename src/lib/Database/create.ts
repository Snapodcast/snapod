import storage from 'electron-json-storage';
import { v4 as uuidv4 } from 'uuid';
import updateMain from './updateMain';

export default async function podcastCreate(params: Podcast) {
  const processData = async (): Promise<{
    status: boolean;
    id?: string;
    msg: string;
  }> => {
    return new Promise((resolve) => {
      // Set current data path
      storage.setDataPath(params.dir);

      // Generate podcast ID
      const id = uuidv4();

      // Determine if podcast already exists
      storage.has(`snapod_podcast_data_${id}`, (error1, hasKey) => {
        if (error1)
          resolve({
            status: false,
            msg: `An internal error has occurred`,
          });

        // Create data file
        if (!hasKey) {
          // Set id key
          const paramsFull = {
            id,
            ...params,
          };
          // Create json file
          storage.set(
            `snapod_podcast_data_${id}`,
            paramsFull,
            async (error2) => {
              if (error2)
                resolve({
                  status: false,
                  msg: `An internal error has occurred`,
                });

              // Update main data file
              await updateMain(paramsFull);
              resolve({
                status: true,
                id,
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
      });
    });
  };
  return processData();
}
