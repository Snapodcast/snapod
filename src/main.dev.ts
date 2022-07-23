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
import os from 'os';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  nativeTheme,
  autoUpdater,
} from 'electron';
import Store from 'electron-store';
import MenuBuilder from './menu';
import enLang from './locales/en.json';
import zhLang from './locales/zh.json';

// Create a new Electron Store instance
const store = new Store();

// Constants
const isDevEnv =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const isProdEnv = process.env.NODE_ENV === 'production';
const appLang = store.get('appLang') || 'en';
const tSystem = (key: string) => {
  const lang = appLang === 'en' ? enLang : zhLang;
  return lang.system[key];
};
const appPlatform = `${os.platform()}_${os.arch()}`;
const appVersion = app.getVersion();
const updateChannel = store.get('appUpdateChannel') || 'stable';

// Install source map support
if (isProdEnv) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// Require electron debug when in development mode or debugging
if (isDevEnv) {
  require('electron-debug')();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  const storedTheme = store.get('theme');

  // Set app theme
  if (storedTheme) {
    nativeTheme.themeSource = storedTheme === 'dark' ? 'dark' : 'light';
  } else {
    nativeTheme.themeSource = 'system';
  }

  // Locate resources
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Create & load the main window
  if (process.platform === 'darwin') {
    // macOS
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
    // Windows and Linux
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

  // Open Devtools if in development mode
  mainWindow.webContents.once('dom-ready', () => {
    if (isDevEnv) {
      mainWindow?.webContents.openDevTools({ mode: 'undocked' });
    }
  });

  // Show and focus the window when it's ready
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error(tSystem('failedToCreateAppWindow'));
    }

    // Minimize window on start (if required)
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Send fullscreen state to React
  mainWindow.on('enter-full-screen', () => {
    mainWindow?.webContents.send(
      'full-screen-change',
      mainWindow?.isFullScreen()
    );
  });
  mainWindow.on('leave-full-screen', () => {
    mainWindow?.webContents.send(
      'full-screen-change',
      mainWindow?.isFullScreen()
    );
  });

  // Destroy the window when it closes
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create app menu
  const menuBuilder = new MenuBuilder(mainWindow, tSystem);
  menuBuilder.buildMenu();

  // Handle opening external urls within the app
  const handleRedirect = (e: Event, url: string) => {
    if (url !== mainWindow?.webContents.getURL()) {
      e.preventDefault();
      // Open links in the user's browser
      shell.openExternal(url);
    }
  };
  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);

  if (isProdEnv) {
    let releaseServerUrl = 'https://download.snapodcast.com/update';
    if (updateChannel !== 'stable') {
      releaseServerUrl = `${releaseServerUrl}/channel/${updateChannel}`;
    }

    // Activate auto updater
    autoUpdater.setFeedURL({
      url: `${releaseServerUrl}/${appPlatform}/${appVersion}`,
    });

    // Check for updates on startup
    autoUpdater.checkForUpdates();

    // Then check for updates every hour
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 3600000);
  }
};

/**
 * Auto updater event handlers
 */

autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: [tSystem('quitAndInstall'), tSystem('later')],
    title: tSystem('applicationUpdate'),
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: tSystem('updateDescription'),
  };

  dialog
    .showMessageBox(dialogOpts)
    .then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      }
    })
    .catch(() => {
      console.log('Failed to quit and install');
    });
});

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application:');
  console.log('Platform:', appPlatform);
  console.log('Version:', appVersion);
  console.error(message);
});

autoUpdater.on('update-not-available', () => {
  console.log('Update not available.');
});

/**
 * App event listeners
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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * Event listeners
 */

// Select directory
ipcMain.handle('select-dir', async () => {
  if (mainWindow) {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    return result.filePaths;
  }
  return [];
});

// Select image
ipcMain.handle('select-image', async () => {
  const result = await dialog.showOpenDialog({
    title: tSystem('selectAnImage'),
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
    title: tSystem('selectAnAudioFile'),
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

// Hide sidebar
ipcMain.handle('hide-sidebar', async () => {
  let status = true;
  if (store.has('sidebar-hidden')) {
    status = !store.get('sidebar-hidden');
  }
  store.set('sidebar-hidden', status);
  mainWindow?.webContents.send('hide-sidebar', status);
});

/* Appearance setting event handlers */
// Set theme
ipcMain.handle(
  'set-theme',
  async (_event, targetTheme: 'light' | 'dark' | 'system') => {
    // update current app theme
    nativeTheme.themeSource = targetTheme;
    // store theme setting in store
    store.set('theme', targetTheme);
  }
);

// Get theme
ipcMain.on('get-theme', async (event) => {
  event.returnValue = nativeTheme.themeSource;
});

/*
 * Electron store event handlers
 */

// Get the value of a key from store
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

// Update a key in store
ipcMain.handle(
  'store-set',
  (
    _event,
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
    return true;
  }
);

// Delete a key in store
ipcMain.handle(
  'store-delete',
  (
    _event,
    arg: {
      key: string;
    }
  ) => {
    store.delete(arg.key);
    return true;
  }
);
