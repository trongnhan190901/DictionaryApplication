const { ipcRenderer } = require('electron/renderer')    
const fs = require('fs')    
const path = require('path')

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const mainContent = document.querySelector('.main-content');
const searchRequest = document.querySelector('.search-request');
const searchUndefined = document.querySelector('.search-undefined');
const contentRender = document.querySelector('.content-render');
const likeButton = document.querySelector('.like-button');
const activeButton = document.querySelector('.active-button');
const inactiveButton = document.querySelector('.inactive-button')
const addWord = document.querySelector('.add-word');
const favoriteDeleteBtn = document.querySelector('.favorite-delete-btn');
const recentDeleteBtn = document.querySelector('.recent-delete-btn');

let favoriteArr = []
let recentArr = []
let desc

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
    else {
      searchRequest.classList.add("hidden")
    }
})

ipcRenderer.on('search-result',(event, data) => {
  if (data !== undefined) {
      searchUndefined.classList.add("hidden")
      mainContent.classList.remove("hidden")
      this.activeLike(false)
      contentRender.innerHTML = data.html
      const exist = favoriteArr.find((e) => e.word === data?.word);
      desc = data?.description
      if (exist) this.activeLike(true);

      const recent = recentArr.find((e) => e.word === data?.word);
      const word = document.querySelector(".content-render h1").innerText;
      const obj = {
        word,
        desc,
      }
      if (!recent) {
        recentArr.unshift(obj)
        this.writeWordsToFile("recent", recentArr);
        this.buildRecentList(recentArr)
      }
  }
  else{
      mainContent.classList.add("hidden")
      searchUndefined.classList.remove("hidden")
  }
})

function activeLike(bool){
  if (bool) {
    activeButton.classList.remove("hidden")
    inactiveButton.classList.add("hidden")
  }
  else {
    activeButton.classList.add("hidden")
    inactiveButton.classList.remove("hidden")
  }
}

likeButton.addEventListener('click', () => {
  const word = document.querySelector(".content-render h1").innerText;
  const obj = {
    word,
    desc,
  }
  const exits = favoriteArr.find(e => e.word === word)
  if (!exits){
    favoriteArr.unshift(obj)
    this.activeLike(true)
    this.buildFavoriteList(favoriteArr)
  }
  else {
    favoriteArr = favoriteArr.filter(e => e.word !== word)
    this.activeLike(false)
    this.buildFavoriteList(favoriteArr)
  }
  this.writeWordsToFile("favorite", favoriteArr)
})

const favoriteList = document.querySelector('.favorite-list')
function buildFavoriteList(data) {
  favoriteList.innerHTML = null
  data.map(e => {
    favoriteList.innerHTML += `
      <div>
        <div>
          <h2>${e.word}:&nbsp</h2>
          <span>${e.desc}</span>
        </div>
      </div>`
  })
}

const recentList = document.querySelector('.recent-list')
function buildRecentList(data) {
  recentList.innerHTML = null
  data.map(e => {
    recentList.innerHTML += `
      <div>
        <div>
          <h2>${e.word}:&nbsp</h2>
          <span>${e.desc}</span>
        </div>
      </div>`
  })
}

function writeWordsToFile (fileName, obj) {
  try {
    fs.writeFileSync(
      path.join(
        __dirname,  
        `../../`,
        `local`,
        `${fileName}.json`
      ),
      JSON.stringify(obj)
    );
  } catch (err) {
    console.log(err);
  }
}

 function readJSONtoWords (fileName) {
  try {
    const recentData = fs.readFileSync(
      path.join(
        __dirname,  
        `../../`,
        `local`,
        `recent.json`
      ),
    );
    const favoriteData = fs.readFileSync(
      path.join(
        __dirname,  
        `../../`,
        `local`,
        `favorite.json`
      ),
    );
      recentArr = JSON.parse(recentData);  
      buildRecentList(recentArr)
      favoriteArr = JSON.parse(favoriteData);  
      buildFavoriteList(favoriteArr)
  } catch (e) {
    this.writeWordsToFile(fileName, []);
  }
}

addWord.addEventListener('submit', e => {
  e.preventDefault()
  const newWordObj = {
    word: addWord.word.value,
    description: `${addWord.catalog.value}: ${addWord.meaning.value}`,
    pronounce: `/${addWord.pronounce.value}/`,
    html: `<h1>${addWord.word.value}</h1><h2>${addWord.catalog.value}</h2><ul><li>${addWord.meaning.value}</li><li>${addWord.example.value}</li></ul>`
  }
  ipcRenderer.send('new-word',newWordObj)

  addWord.word.value = '',
  addWord.meaning.value = '',
  addWord.pronounce.value = '',
  addWord.catalog.value = '',
  addWord.example.value = ''
})

favoriteDeleteBtn.addEventListener('click', (e) =>{
  e.preventDefault()
  favoriteArr = []
    this.writeWordsToFile("favorite", favoriteArr)
    this.buildFavoriteList(favoriteArr)
    searchInput.value = ''
    mainContent.classList.add("hidden")
    searchRequest.classList.remove("hidden")
})

recentDeleteBtn.addEventListener('click', (e) =>{ 
    e.preventDefault()
    recentArr = []
    this.writeWordsToFile("recent", recentArr)
    this.buildRecentList(recentArr)
    searchInput.value = ''
    mainContent.classList.add("hidden")
    searchRequest.classList.remove("hidden")  ()
})

readJSONtoWords('favorite')
readJSONtoWords('recent')