const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const PDFDocument = require('pdfkit');

// Cria a janela principal
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

// Manipulador para converter arquivo TXT em PDF
ipcMain.handle('convert', async (event, filePath) => {
  const path = require('path');

  try {
    let text = await fs.readFile(filePath, 'utf-8');

    // Remove BOM se existir
    text = text.replace(/^\uFEFF/, '');

    const baseName = path.basename(filePath, '.txt');
    const sanitized = baseName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_\- ]/g, '')
      .replace(/\s+/g, '_');

    const dir = path.dirname(filePath);
    const outputPath = path.join(dir, sanitized + '.pdf');

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputPath);

    return await new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log("PDF criado:", outputPath);
        resolve(outputPath);
      });

      writeStream.on('error', reject);

      doc.pipe(writeStream);

      // FONTE COMPATÍVEL COM ACENTOS
      doc.font('Helvetica');
      doc.fontSize(12);

      // Garantindo UTF-8 correto
      const safeText = Buffer.from(text, 'utf-8').toString();
      doc.text(safeText, { align: 'left' });

      doc.end();
    });

  } catch (err) {
    return { error: err.message };
  }
});

// Manipulador para abrir o arquivo PDF gerado
ipcMain.handle('open-file', async (_, filePath) => {
  try {
    const { shell } = require('electron');
    console.log("Abrindo:", filePath);
    await shell.openPath(filePath);
    return { ok: true };

  } catch (err) {
    return { error: err.message };
  }
});