import { ipcRenderer } from 'electron';

export const get = (key: string): any => {
  return ipcRenderer.sendSync('store-get', {
    key,
  });
};

export const set = (key: string, value: string): any => {
  return ipcRenderer.sendSync('store-set', {
    key,
    value,
  });
};

export interface StoreInterface {
  currentUser: {
    cuid: string;
    email: string;
    type: string;
    token: string;
  };
}
