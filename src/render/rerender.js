const { ipcRenderer } = require('electron/renderer')
const searchForm = document.querySelector('.search-form')
const searchInput = document.querySelector('.search-input')
const mainContent = document.querySelector('.main-content');
const searchRequest = document.querySelector('.search-request');
const searchUndefined = document.querySelector('.search-undefined');

searchForm.addEventListener('submit',(e) => {
    e.preventDefault()
})

searchInput.addEventListener('keyup', (e) => {
    ipcRenderer.send('search-value', e.target.value)
    if (!e.target.value) {
        searchUndefined.classList.add("hidden")
        mainContent.classList.add("hidden")
        searchRequest.classList.remove("hidden")
    }
    else searchRequest.classList.add("hidden")
})

ipcRenderer.on('search-result',(event, data) => {
    if (data !== undefined) {
        searchUndefined.classList.add("hidden")
        mainContent.classList.remove("hidden")
        mainContent.innerHTML = data.html
    }
    else{
        mainContent.classList.add("hidden")
        searchUndefined.classList.remove("hidden")
    }
})