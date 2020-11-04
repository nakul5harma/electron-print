const electron = require('electron');

// Importing BrowserWindow from Main
const { BrowserWindow } = electron.remote;

const current = document.getElementById('current');
const url = document.getElementById('url');

const options = {
  silent: false,
  printBackground: true,
  color: false,
  margin: {
    marginType: 'printableArea',
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Header of the Page',
  footer: 'Footer of the Page',
};

current.addEventListener('click', () => {
  const win = BrowserWindow.getFocusedWindow();
  // let win = BrowserWindow.getAllWindows()[0];

  win.webContents.print(options, (success, failureReason) => {
    if (!success) {
      // eslint-disable-next-line no-console
      console.log(failureReason);
    }

    // eslint-disable-next-line no-console
    console.log('Print Initiated');
  });
});

url.addEventListener('click', () => {
  // Defining a new BrowserWindow Instance
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadURL('https://www.google.com/');

  win.webContents.on('did-finish-load', () => {
    win.webContents.print(options, (success, failureReason) => {
      if (!success) {
        // eslint-disable-next-line no-console
        console.log(failureReason);
      }

      // eslint-disable-next-line no-console
      console.log('Print Initiated');
    });
  });
});
