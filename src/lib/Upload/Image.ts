import { ipcRenderer } from 'electron';
import uploadFileToCDN from '../Qiniu';

/* Select cover art image action */
const selectImage = async () => {
  const imagePaths = await ipcRenderer.invoke('select-image');
  if (imagePaths.length) {
    return uploadFileToCDN(imagePaths[0]);
  }
  return '';
};
