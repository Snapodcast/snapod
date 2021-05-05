import { ipcRenderer } from 'electron';
import uploadFileToCDN from '../Qiniu';

export default async function selectAudioFileAndUploadToCDN() {
  let localPath = '';
  let remotePath = '';
  const audioFilePaths: string[] = await ipcRenderer.invoke(
    'select-audio-file'
  );
  if (audioFilePaths.length) {
    [localPath] = audioFilePaths;
    remotePath = await uploadFileToCDN(audioFilePaths[0]);
  }
  return {
    localPath,
    remotePath,
  };
}
