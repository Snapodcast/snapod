import { ipcRenderer } from 'electron';

export interface StoreInterface {
  currentUser: {
    cuid: string;
    email: string;
    type: string;
    token: string;
  };
}

/**
 * Send a message to the main process to get a value from the store.
 *
 * @param {string} key
 * @return {*}  {*}
 */
const get = (key: string): any => {
  return ipcRenderer.sendSync('store-get', {
    key,
  });
};

/**
 * Send a message to the main process to set a value in the store.
 *
 * @param {*} key
 * @param {string} [value]
 * @return {*}  {*}
 */
const set = async (key: any, value?: string): Promise<void> => {
  await ipcRenderer.invoke('store-set', {
    key,
    value,
  });
};

/**
 * Send a message to the main process to remove a value from the store.
 *
 * @param {string} key
 * @return {*}  {*}
 */
const remove = async (key: string): Promise<void> => {
  await ipcRenderer.invoke('store-delete', {
    key,
  });
};

export default {
  get,
  set,
  remove,
};
