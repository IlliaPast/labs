// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onAction: (cb) => ipcRenderer.on('action', (e, type, data) => cb(type, data)),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});

// Відповідаємо на запит main у renderer
ipcRenderer.handle('get-content', () => {
  return document.getElementById('editor').value;
});
