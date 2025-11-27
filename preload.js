const { contextBridge, ipcRenderer } = require('electron');

// Expondo a API segura para o renderer process
contextBridge.exposeInMainWorld('api', {
  selectTxt: () => ipcRenderer.invoke('select-txt'),
  convert: (file) => ipcRenderer.invoke('convert', file),
  openFile: (path) => ipcRenderer.invoke('open-file', path)
});