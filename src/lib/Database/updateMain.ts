const storage = require('electron-json-storage');
const md5 = require('md5');
const { rootPath } = require('electron-root-path');

interface Podcast {
  dir: string;
  logo: string;
  name: string;
  description: string;
  author: string;
  advisory: string;
  owner: {
    name: string;
    email: string;
  };
}

module.exports = function updateMain(params: Podcast) {
  // Set current data path
  storage.setDataPath(rootPath);

  // Determine if main data file exist
  storage.has(`snapod_main_data`, function (error1, hasKey) {
    if (error1) throw error1;

    // Create main data file
    if (!hasKey) {
      storage.set(`snapod_main_data`, { podcasts: [params] }, function (
        error2
      ) {
        if (error2) throw error2;
      });
    } else {
      // Get current main data file
      storage.get('snapod_main_data', function (error3, data) {
        if (error3) throw error3;
        // Update main data file
        storage.set(
          `snapod_main_data`,
          { podcasts: data.podcasts.concat(params) },
          function (error4) {
            if (error4) throw error4;
          }
        );
      });
    }
  });
};
