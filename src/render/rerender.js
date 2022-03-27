const { ipcRenderer } = require('electron/renderer')

let favoriteArr = [];
function addData(data) {
  let innerObject = {
    word: data.word,
    description: data.description
  }
  favoriteArr.unshift(innerObject);
}

function removeData(data) {
  let exits = favoriteArr.findIndex((e) => e.word === data.word)
  favoriteArr.splice(exits, 1)
}

// Rerender find.html

const searchForm = document.querySelector('.search-form')
const searchInput = document.querySelector('.search-input')
const mainContent = document.querySelector('.main-content');
const searchRequest = document.querySelector('.search-request');
const searchUndefined = document.querySelector('.search-undefined');
const contentRender = document.querySelector('.content-render');
const activeButton = document.querySelector('.active-button');
const inactiveButton = document.querySelector('.inactive-button');
let dataReceive = {};

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
    dataReceive = data;

    if (data !== undefined) {
        searchUndefined.classList.add("hidden")
        mainContent.classList.remove("hidden")
        contentRender.innerHTML = data.html
        let exits = favoriteArr.find((e) => e.word === data.word)
        if (exits) { 
          inactiveButton.classList.add("hidden")
          activeButton.classList.remove("hidden")
        }
        else {
          activeButton.classList.add("hidden")
          inactiveButton.classList.remove("hidden")
        }
    }
    else{
        mainContent.classList.add("hidden")
        searchUndefined.classList.remove("hidden")
    }
    
    inactiveButton.addEventListener("click", (event, data) => {
      data = dataReceive;
      if (activeButton.classList.contains("hidden")) {
        activeButton.classList.remove("hidden")
        inactiveButton.classList.add("hidden")
        addData(data)
        console.log(favoriteArr);
        buildFavoriteList(data)
      } 
    })
   
    activeButton.addEventListener("click", (event, data) => {
      data = dataReceive;
      if (inactiveButton.classList.contains("hidden")) {
        inactiveButton.classList.remove("hidden")
        activeButton.classList.add("hidden")
        removeData(data)
      }
    });
    
})


// Rerender favorite

function buildFavoriteList(data) {
  const favoriteList = document.querySelector('.favorite-list')
  const wordData = document.createElement('h2')
  const descData = document.createElement('span')
    wordData.innerHTML = data.word
    descData.innerHTML = data.description
    favoriteList.appendChild(wordData)
    favoriteList.appendChild(descData)
}

