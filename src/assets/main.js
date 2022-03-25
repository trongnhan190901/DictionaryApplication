// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
  

const Loader = require('./load.js')
const bstForest = [];
// Load and build data file into BST
function load(){
    for (let i = 0; i < 26; i++) {
        const tree =  Loader.init((i + 10).toString(36))
        bstForest.push(tree);
    }
}
let mainWindow;
function createWindow() {
    // Create the browser window.
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

    // and load the index.html of the app.

    mainWindow.loadFile('./src/layout/html/find.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.webContents.on('did-finish-load', () => {
        /// then close the loading screen window and show the main window
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
      /// define width and height for the window
      width: 350,
      height: 200,
      /// remove the window frame, so it will become a frameless window
      frame: false,
      /// and set the transparency, to remove any window background color
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createLoadingScreen();
    createWindow();
  
    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// receive message from index.html 
ipcMain.on('search-value', (event, arg) => {
  const searchValue = arg.trim()
  const i = +searchValue.charCodeAt(0) - 97
  
  if(searchValue.length){
    const searchResult = bstForest[i]?.search({word: searchValue})
    mainWindow.webContents.send('search-result', searchResult?.value)
  }
  });