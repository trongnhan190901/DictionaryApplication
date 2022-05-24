const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

const readFile = require('./readFile.js')
const writeFile = require('./writeFile')
const bstForest = [];

function load() {
  for (let i = 0; i < 26; i++) {
    const tree = readFile.init((i + 10).toString(36))
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
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,

  })
  mainWindow.removeMenu()
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

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('search-value', (event, data) => {
  const searchValue = data.trim()
  const i = +searchValue.charCodeAt(0) - 97
  let notExist = searchValue
  if (searchValue.length) {
    const searchResult = bstForest[i]?.search({ word: searchValue })
    mainWindow.webContents.send('search-result', searchResult?.value, notExist)
  }
});

ipcMain.on('new-word', (event, data) => {

  const i = +data?.word.charCodeAt(0) - 97
  const exits = bstForest[i].search({ word: data.word })
  let success = false;
  const dialogOptions = {
    type: "info",
    buttons: ["Trở về!"],
    defaultId: 1,
    title: " Thêm từ thành công!",
    message: "Bạn đã thêm từ thành công",
  };

  if (!exits) {
    bstForest[i].insert(data)
    writeFile(data.word.charAt(0), data, 'add')
    success = true;
  }
  else {
    const dialogOptions = {
      title: " Từ đã tồn tại!",
      message: "Từ đã tồn tại, bạn muốn tiếp tục thêm không?",
      type: "question",
      buttons: ["Thêm", "Trở về"],
      defaultId: 1,
    };
    const choiceIdx = dialog.showMessageBoxSync(mainWindow, dialogOptions);

    if (choiceIdx === 0) {
      const dialogOptions = {
        title: "Lựa chọn cách thêm",
        message: "Thêm ghi đè hoặc nối tiếp? CẨN THẬN với thêm ghi đè!",
        type: "question",
        buttons: ["Ghi đè", "Nối tiếp", "Trở về"],
        defaultId: 2,
      };
      const choiceIdx = dialog.showMessageBoxSync(mainWindow, dialogOptions);
      if (choiceIdx === 0) {
        //override
        exits.value = data;
        writeFile(data.word.charAt(0), exits.value, 'overwrite')
        success = true;
      } else if (choiceIdx === 1) {
        const i = +data?.word.charCodeAt(0) - 97
        const exits = bstForest[i].search({ word: data.word })
        const regex = /<s*h1[^>]*>(.*?)<s*\/s*h1>/;
        data.html = data.html.replace(regex, "");
        exits.value.html += data.html;
        writeFile(data.word.charAt(0), exits.value, 'additional')
        success = true;
      }
    }
  }
  if (success) {
    const choiceIdx = dialog.showMessageBoxSync(mainWindow, dialogOptions);
    if (choiceIdx === 1) {
      mainWindow.webContents.send("add-word-success");
    }
  }
})
