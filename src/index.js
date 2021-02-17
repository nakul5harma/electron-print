const { ipcRenderer, remote } = require('electron');

// Importing BrowserWindow from Main
const { BrowserWindow } = remote;

const current = document.getElementById('current');
const url = document.getElementById('url');
const bwPng = document.getElementById('bw-png');
const bwPdf3Inch = document.getElementById('bw-pdf-3-inch');
const bwPdfActualSize = document.getElementById('bw-pdf-actual-size');
const colorPng = document.getElementById('color-png');
const colorPdf3Inch = document.getElementById('color-pdf-3-inch');

const receiptFileNames = {
  bwPng: 'pledge_receipt_bw_images.png',
  bwPdf3Inch: 'pledge_receipt_bw_images_3_inch.pdf',
  bwPdfActualSize: 'pledge_receipt_bw_images_actual_size.pdf',
  colorPng: 'pledge_receipt_color_images.png',
  colorPdf3Inch: 'pledge_receipt_color_images_3_inch.pdf',
};

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

const printFileByFilePath = (fileName) => {
  ipcRenderer.invoke('print-receipt', fileName);
};

bwPng.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.bwPng);
});

bwPdf3Inch.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.bwPdf3Inch);
});

bwPdfActualSize.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.bwPdfActualSize);
});

colorPng.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.colorPng);
});

colorPdf3Inch.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.colorPdf3Inch);
});
