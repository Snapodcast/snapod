import storage from 'electron-json-storage';
import electron from 'electron';

export default async function updateMain(params: Podcast) {
  const processData = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Set current data path
      storage.setDataPath(
        (electron.app || electron.remote.app).getPath('userData')
      );

      // Determine if main data file exist
      storage.has(`snapod_main_data`, (error1, hasKey) => {
        if (error1) reject(error1);

        // Create main data file
        if (!hasKey) {
          storage.set(`snapod_main_data`, { podcasts: [params] }, (error2) => {
            if (error2) reject(error2);
          });
        } else {
          // Get current main data file
          storage.get('snapod_main_data', (error3, data: MainData) => {
            if (error3 || !data.podcasts) reject(error3);
            // Update main data file
            else
              storage.set(
                `snapod_main_data`,
                { podcasts: data.podcasts.concat(params) },
                (error4) => {
                  if (error4) reject(error4);
                  resolve(true);
                }
              );
          });
        }
      });
    });
  };
  const status = await processData();
  return status;
}
