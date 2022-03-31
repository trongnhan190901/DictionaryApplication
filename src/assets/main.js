const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const readFile = require('./readFile.js')
const writeFile = require('./writeFile')
const bstForest = [];

function load(){
    for (let i = 0; i < 26; i++) {
        const tree =  readFile.init((i + 10).toString(36))
        bstForest.push(tree);
    }
}
let mainWindow;
function createWindow() {
     mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation:false,
          preload: path.join(__dirname, 'preload.js'),
        },
        show:false
    })

    mainWindow.loadFile('./src/layout/html/index.html')

    mainWindow.webContents.on('did-finish-load', () => {
        if (loadingScreen) {
            load()
            loadingScreen.close();
        }
        mainWindow.show();
      });
    
}

var loadingScreen;
const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(
    Object.assign({
      width: 350,
      height: 200,
      frame: false,
      transparent: true
    })
  );
  loadingScreen.setResizable(false);
  loadingScreen.loadFile('./src/layout/html/loading.html');
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
  loadingScreen.show();
  });
};

app.whenReady().then(() => {
    createLoadingScreen();
    createWindow();
  
    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('search-value', (event, data) => {
  const searchValue = data.trim()
  const i = +searchValue.charCodeAt(0) - 97
  
  if(searchValue.length){
    const searchResult = bstForest[i]?.search({word: searchValue})
    mainWindow.webContents.send('search-result', searchResult?.value)
  }
  });

ipcMain.on('new-word', (event, data) => {
  const i = +data?.word.charCodeAt(0) - 97
  const exits = bstForest[i].search({word: data.word})
  if (!exits){
    bstForest[i].insert(data)
    writeFile(data.word.charAt(0), data)
    }
})


