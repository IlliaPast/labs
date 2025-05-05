// main.js
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs   = require('fs');
const path = require('path');

let mainWindow;
let currentFile = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  buildMenu();
}

function buildMenu() {
  const template = [{
    label: 'Файл',
    submenu: [
      {
        label: 'Новий',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          currentFile = null;
          mainWindow.webContents.send('action', 'new');
        }
      },
      {
        label: 'Відкрити…',
        accelerator: 'CmdOrCtrl+O',
        click: async () => {
          const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
              { name: 'Текстові файли', extensions: ['txt'] },
              { name: 'Всі файли', extensions: ['*'] }
            ]
          });
          if (!canceled) {
            currentFile = filePaths[0];
            const content = fs.readFileSync(currentFile, 'utf-8');
            mainWindow.webContents.send('action', 'open', {
              content,
              filename: path.basename(currentFile)
            });
          }
        }
      },
      {
        label: 'Зберегти',
        accelerator: 'CmdOrCtrl+S',
        click: () => saveFile()
      },
      {
        label: 'Зберегти як…',
        click: () => saveAs()
      },
      { type: 'separator' },
      { role: 'quit', label: 'Вихід' }
    ]
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function saveFile() {
  if (!currentFile) return saveAs();
  const content = await mainWindow.webContents.invoke('get-content');
  fs.writeFileSync(currentFile, content, 'utf-8');
}

async function saveAs() {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: 'untitled.txt',
    filters: [
      { name: 'Текстові файли', extensions: ['txt'] },
      { name: 'Всі файли', extensions: ['*'] }
    ]
  });
  if (!canceled && filePath) {
    const content = await mainWindow.webContents.invoke('get-content');
    fs.writeFileSync(filePath, content, 'utf-8');
    currentFile = filePath;
    mainWindow.webContents.send('action', 'saved-as', {
      filename: path.basename(currentFile)
    });
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// Обробка запиту з renderer на отримання тексту
ipcMain.handle('get-content', () => {
  // нічого не повертаємо тут — preload.js буде читати textarea напряму
  return null;
});
