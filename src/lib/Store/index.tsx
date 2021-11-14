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
const set = (key: any, value?: string): any => {
  return ipcRenderer.sendSync('store-set', {
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
const remove = (key: string): any => {
  return ipcRenderer.sendSync('store-delete', {
    key,
  });
};

export default {
  get,
  set,
  remove,
};
