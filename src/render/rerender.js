const { ipcRenderer } = require('electron/renderer')
const buttonClick = document.querySelector('.button-click')
buttonClick.addEventListener('click',() => {
    data()
})
function data(){
    ipcRenderer.send('search-input','def');   
}

ipcRenderer.on('reply',(event, data) => {
    console.log(data);
})