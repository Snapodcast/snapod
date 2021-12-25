import { ipcRenderer } from 'electron';
import uploadFilepath from '../Qiniu';
import mp3Duration from 'mp3-duration';
import toDurationString from '../../utilities/format/duration';
import fs from 'fs';

export default async function selectAudioFileAndUploadToCDN() {
  let localPath = null;
  let remotePath = null;
  let length = null;
  let size = null;

  const audioFilePaths: string[] = await ipcRenderer.invoke(
    'select-audio-file'
  );

  if (audioFilePaths.length) {
    [localPath] = audioFilePaths;
    remotePath = await uploadFilepath(audioFilePaths[0]);
    length = await mp3Duration(localPath);
    size = fs.statSync(localPath).size;
  }
  return {
    localPath,
    remotePath,
    duration: toDurationString(length),
    size,
  };
}
