const storage = require('electron-json-storage');
const md5 = require('md5');
const updateMain = require('./updateMain');

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

export default function podcastCreate(params: Podcast) {
  // Set current data path
  storage.setDataPath(params.dir);

  // Determine if podcast already exists
  storage.has(`snapod_podcast_data_${md5(params.name)}`, function (
    error1,
    hasKey
  ) {
    if (error1) throw error1;

    // Create data file
    if (!hasKey) {
      storage.set(`snapod_podcast_data_${md5(params.name)}`, params, function (
        error2
      ) {
        if (error2) throw error2;

        // Update main data file
        updateMain(params);

        alert(`${params.name} has been created and added to your podcast list`);
      });
    } else {
      alert('Podcast already exists, no change has been made');
    }
  });
}
