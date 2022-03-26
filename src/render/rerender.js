const { ipcRenderer } = require('electron/renderer')
const fs = require('fs')

let wordArr = [];
let descArr = [];
function addData(data) {
  wordArr.push(data.word);
  descArr.push(data.description)
}

// Read and write local file

// fs.readFile('../local/favorite.json', 'utf8', (err, data) => {
//   if(data != ''){
//       wordArr = JSON.parse(data)
//   }
//   wordArr.push(this)           
// });
// fs.writeFile('../local/favorite.json', JSON.stringify(Object.assign({}, wordArr)), (err) => {
//   console.log(err)
// }); 

// Rerender find.html

const searchForm = document.querySelector('.search-form')
const searchInput = document.querySelector('.search-input')
const mainContent = document.querySelector('.main-content');
const searchRequest = document.querySelector('.search-request');
const searchUndefined = document.querySelector('.search-undefined');
const contentRender = document.querySelector('.content-render');
const button = document.querySelector(".like-button");
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

function removeData(data) {
  const index = arr.indexOf(data)
  if (index !== -1)
  wordArr.splice(index, 1)
  descArr.splice(index, 1)
}

ipcRenderer.on('search-result',(event, data) => {
    dataReceive = data;

    if (data !== undefined) {
        searchUndefined.classList.add("hidden")
        mainContent.classList.remove("hidden")
        contentRender.innerHTML = data.html
        let exits = wordArr.includes(data.word)
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

const favoriteList = document.querySelector('.favorite-list')


