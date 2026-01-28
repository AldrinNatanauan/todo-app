require('dotenv').config();

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const START_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.ELECTRON_START_URL
      : `file://${path.join(__dirname, 'dist/index.html')}`;

  win.loadURL(START_URL);


}

app.whenReady().then(createWindow);
