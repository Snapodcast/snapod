/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import MenuBuilder from './menu';

const Store = require('electron-store');

const store = new Store();

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Create main window
  // macOS
  if (process.platform === 'darwin') {
    mainWindow = new BrowserWindow({
      show: false,
      center: true,
      minWidth: 950,
      minHeight: 600,
      width: 950,
      height: 640,
      icon: getAssetPath('icon.icns'),
      frame: false,
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 20, y: 33 },
      vibrancy: 'sidebar',
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });
  } else {
    mainWindow = new BrowserWindow({
      show: false,
      center: true,
      minWidth: 950,
      minHeight: 600,
      width: 950,
      height: 625,
      icon: getAssetPath('icon.ico'),
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });
  }

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.once('dom-ready', () => {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      mainWindow.webContents.openDevTools({ mode: 'undocked' });
    }
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send(
      'full-screen-change',
      mainWindow.isFullScreen()
    );
  });
  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send(
      'full-screen-change',
      mainWindow.isFullScreen()
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  const handleRedirect = (e, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  };

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

/**
 * ICP event listeners...
 */

// Select directory
ipcMain.on('select-dir', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  event.returnValue = result.filePaths;
});

// Select image
ipcMain.handle('select-image', async () => {
  const result = await dialog.showOpenDialog({
    title: '选择图像 Select an image file',
    filters: [
      {
        name: 'Image Files',
        extensions: ['jpg', 'png', 'jpeg'],
      },
    ],
    properties: ['openFile'],
  });
  return result.filePaths;
});

// Select audio file
ipcMain.handle('select-audio-file', async () => {
  const result = await dialog.showOpenDialog({
    title: '选择节目音频 Select an audio file',
    filters: [
      {
        name: 'Audio Files',
        extensions: ['mp3', 'm4a'],
      },
    ],
    properties: ['openFile'],
  });
  return result.filePaths;
});

// Get from store
ipcMain.on(
  'store-get',
  async (
    event,
    arg: {
      key: string;
      value?: string;
    }
  ) => {
    const result = store.get(arg.key);
    event.returnValue = result;
  }
);

// Set in store
ipcMain.on(
  'store-set',
  (
    event,
    arg: {
      key: any;
      value?: string;
    }
  ) => {
    if (arg.value) {
      store.set(arg.key, arg.value);
    } else {
      store.set(arg.key);
    }
    event.returnValue = true;
  }
);

// Delete in store
ipcMain.on(
  'store-delete',
  (
    event,
    arg: {
      key: string;
    }
  ) => {
    store.delete(arg.key);
    event.returnValue = true;
  }
);

// Hide sidebar
ipcMain.on('hide-sidebar', async () => {
  let status = true;
  if (store.has('sidebar-hidden')) {
    status = !store.get('sidebar-hidden');
  }
  store.set('sidebar-hidden', status);
  mainWindow.webContents.send('hide-sidebar', status);
});
