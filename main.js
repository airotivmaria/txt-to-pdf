const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const PDFDocument = require('pdfkit');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle('select-txt', async () => {
  const result = await dialog.showOpenDialog({
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
    properties: ['openFile']
  });
  return result.filePaths[0];
});

ipcMain.handle('convert', async (event, filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    const outputPath = filePath.replace('/\.txt$/i', '.pdf');

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);
    doc.font('Times-Roman').fontSize(12).text(text);
    doc.end();

    return outputPath;
  } catch (err) {
    return { error: err.message };
  }
});