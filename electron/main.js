require('dotenv').config();

const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
let backend;

async function startBackend() {
  if (!backend) {
    const backendPath = isDev
      ? path.join(__dirname, '../backend/server.js')
      : path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'server.js');

    try {
      // Use dynamic import() to load ESM modules from CJS
      const url = require('url').pathToFileURL(backendPath).href;
      backend = await import(url);
      if (backend.startServer) backend.startServer();
      console.log('Backend started from:', backendPath);
    } catch (err) {
      console.error('Failed to start backend:', err);
    }
  }
}

function stopBackend() {
  if (backend && backend.stopServer) {
    backend.stopServer();
    backend = null;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../assets/icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL(process.env.ELECTRON_START_URL || 'http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
}

app.whenReady().then(async () => {
  process.env.DB_PATH = app.getPath('userData');

  await startBackend();
  createWindow();
});

app.on('before-quit', () => {
  stopBackend();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});