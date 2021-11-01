const { app, BrowserWindow, ipcMain } = require('electron');
const ptp = require('pdf-to-printer');
const fs = require('fs');
const path = require('path');
const { PosPrinter } = require('electron-pos-printer');

const getPledgeReceiptDir = () => path.join(app.getPath('pictures'), 'pledge-receipts');

// eslint-disable-next-line no-console
const logError = (err) => err && console.error(err);

const mkdir = (pledgeReceiptPath) => {
  fs.stat(pledgeReceiptPath, (err, stats) => {
    if (err && err.code !== 'ENOENT') {
      logError(err);
    }

    if (err || !stats.isDirectory()) {
      fs.mkdir(pledgeReceiptPath, logError);
    }
  });
};

const rm = (pledgeReceiptPath) => {
  fs.unlink(pledgeReceiptPath, (error) => {
    if (error) {
      logError(error);
    }
  });
};

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // Load the index.html of the app.
  win.loadFile('src/index.html');

  // Open the DevTools.
  win.webContents.openDevTools();

  mkdir(getPledgeReceiptDir());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// This method is equivalent to 'app.on('ready', function())'
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the
  // app when the dock icon is clicked and there are no
  // other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file, you can include the rest of your
// app's specific main process code. You can also
// put them in separate files and require them here.

ipcMain.handle('print-receipt', (_event, base64fileBuffer, fileExt) => {
  const pledgeReceiptPath = path.join(getPledgeReceiptDir(), `${new Date().getTime()}.${fileExt}`);

  fs.writeFile(pledgeReceiptPath, base64fileBuffer, { encoding: 'base64' }, (err) => {
    if (err) {
      logError(err);
    }

    // eslint-disable-next-line no-console
    console.log('Printing file:', pledgeReceiptPath);

    ptp
      .print(pledgeReceiptPath)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Sent to print queue:', pledgeReceiptPath);
        rm(pledgeReceiptPath);
      })
      .catch((error) => {
        logError(error);
        rm(pledgeReceiptPath);
      });
  });
});

ipcMain.handle('print-receipt-pos', (_event, base64fileBuffer, fileExt) => {
  const pledgeReceiptPath = path.join(getPledgeReceiptDir(), `${new Date().getTime()}.${fileExt}`);

  fs.writeFile(pledgeReceiptPath, base64fileBuffer, { encoding: 'base64' }, (err) => {
    if (err) {
      logError(err);
    }

    const options = {
      preview: false, // Preview in window or print
      width: '300px', //  width of content body
      margin: '0 0 0 0', // margin of content body
      copies: 1, // Number of copies to print
      printerName: 'HiTi P525L', // printerName: string, check it at webContent.getPrinters()
      timeOutPerLine: 400,
      silent: true,
    };

    // eslint-disable-next-line no-console
    const data = [
      {
        type: 'image',
        path: pledgeReceiptPath,
        position: 'center', // position of image: 'left' | 'center' | 'right'
        width: 'auto', // width of image in px; default: auto
        // height: '60px', // width of image in px; default: 50 or '50px'
      },
    ];

    // eslint-disable-next-line no-console
    console.log('Printing file:', data, options);

    PosPrinter.print(data, options)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('POS printing successful');
        rm(pledgeReceiptPath);
      })
      .catch((error) => {
        logError(error);
        rm(pledgeReceiptPath);
      });
  });
});
