const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectTxt: () => ipcRenderer.invoke('select-txt'),
  convert: (file) => ipcRenderer.invoke('convert', file)
});