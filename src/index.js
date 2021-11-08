const { ipcRenderer, remote } = require('electron');
const path = require('path');
const fs = require('fs');
const printJs = require('print-js');

// Importing BrowserWindow from Main
const { BrowserWindow } = remote;

const current = document.getElementById('current');
const url = document.getElementById('url');
const bwPng = document.getElementById('bw-png');
const bwPdf3Inch = document.getElementById('bw-pdf-3-inch');
const bwPdfActualSize = document.getElementById('bw-pdf-actual-size');
const colorPng = document.getElementById('color-png');
const colorPdf3Inch = document.getElementById('color-pdf-3-inch');
const colorPdfSinglePage = document.getElementById('color-pdf-single-page');
const colorJpg6x8 = document.getElementById('color-jpg-6x8');
const libSelect = document.getElementById('lib-select');

const receiptFileNames = {
  bwPng: 'pledge_receipt_bw_images.png',
  bwPdf3Inch: 'pledge_receipt_bw_images_3_inch.pdf',
  bwPdfActualSize: 'pledge_receipt_bw_images_actual_size.pdf',
  colorPng: 'pledge_receipt_color_images.png',
  colorPdf3Inch: 'pledge_receipt_color_images_3_inch.pdf',
  colorPdfSinglePage: 'pledge_receipt_color_images_single_page.pdf',
  colorJpg6x8: 'pledge-receipt_color_images_6x8.jpg',
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

const printWithPrintJs = (filePath, fileExt) => {
  // eslint-disable-next-line no-console
  console.log(`filePath - ${filePath}, fileExt - ${fileExt}`);

  if (fileExt === 'pdf') {
    printJs({ printable: filePath, type: 'pdf' });
  } else if (fileExt === 'png' || fileExt === 'jpeg' || fileExt === 'jpg') {
    printJs({ printable: filePath, type: 'image' });
  }
};

const getLibSelectedValue = () => libSelect.options[libSelect.selectedIndex].value;

const printFileByFilePath = (fileName, fileExt) => {
  const filePath = path.join(__dirname, '..', 'assets', fileName);
  const base64fileBuffer = fs.readFileSync(filePath, { encoding: 'base64' });
  const selectedLib = getLibSelectedValue();

  // eslint-disable-next-line no-console
  console.log(`fileName - ${fileName}, fileExt - ${fileExt}, selectedLib - ${selectedLib}`);

  if (selectedLib === 'pdf-to-printer') {
    ipcRenderer.invoke('print-receipt', base64fileBuffer, fileExt);
  } else if (selectedLib === 'print-js') {
    printWithPrintJs(filePath, fileExt);
  } else if (selectedLib === 'electron-pos-printer') {
    ipcRenderer.invoke('print-receipt-pos', base64fileBuffer, fileExt);
  } else if (selectedLib === 'powershell') {
    ipcRenderer.invoke('print-receipt-powershell', base64fileBuffer, fileExt);
  }
};

bwPng.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.bwPng, 'png');
});

bwPdf3Inch.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.bwPdf3Inch, 'pdf');
});

bwPdfActualSize.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.bwPdfActualSize, 'pdf');
});

colorPng.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.colorPng, 'png');
});

colorPdf3Inch.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.colorPdf3Inch, 'pdf');
});

colorPdfSinglePage.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.colorPdfSinglePage, 'pdf');
});

colorJpg6x8.addEventListener('click', () => {
  printFileByFilePath(receiptFileNames.colorJpg6x8, 'jpeg');
});
