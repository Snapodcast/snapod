import { ipcRenderer } from 'electron';
import uploadFilepath from '../Qiniu';
import fs from 'fs';
import path from 'path';

const toBase64 = (imagePath: string) => {
  const image = fs.readFileSync(imagePath, { encoding: 'base64' });
  const extensionName = path.extname(imagePath);
  return `data:image/${extensionName.split('.').pop()};base64,${image}`;
};

const selectImageAndUploadToCDN = async () => {
  let localPath = null;
  let remotePath = null;

  const imagePaths: string[] = await ipcRenderer.invoke('select-image');

  if (imagePaths.length) {
    [localPath] = imagePaths;
    remotePath = await uploadFilepath(imagePaths[0]);
  }

  return {
    localPath,
    remotePath,
    imagePath: localPath ? toBase64(localPath) : null,
  };
};

export default selectImageAndUploadToCDN;
