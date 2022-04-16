const navFind = document.querySelector('.nav-find');
const navInfo = document.querySelector('.nav-info');
const navAdd = document.querySelector('.nav-add');
const navFavorite = document.querySelector('.nav-favorite');

const findRender = document.querySelector('.find-render');
const listRender = document.querySelector('.list-render');
const addRender = document.querySelector('.add-render');
const favoriteRender = document.querySelector('.favorite-render');

navFind.addEventListener('click',e => {
    e.preventDefault()

    if (navFind.classList.contains('text-gray-600')){
        navFind.classList.remove('text-gray-600')
        navFind.classList.add('text-indigo-700', 'underline', 'underline-offset-8')
        
        navInfo.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
        navAdd.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
        navFavorite.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
       
        navInfo.classList.add('text-gray-600')
        navAdd.classList.add('text-gray-600')
        navFavorite.classList.add('text-gray-600')

        findRender.classList.remove('hidden')
        findRender.classList.add('flex')

        listRender.classList.remove('flex')
        addRender.classList.remove('flex')
        favoriteRender.classList.remove('flex')

        listRender.classList.add('hidden')
        addRender.classList.add('hidden')
        favoriteRender.classList.add('hidden')
    }
})

navInfo.addEventListener('click',e => {
    e.preventDefault()
    if (navInfo.classList.contains('text-gray-600')){
        navInfo.classList.remove('text-gray-600')
        navInfo.classList.add('text-indigo-700', 'underline', 'underline-offset-8')
        
        navFind.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
        navAdd.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
        navFavorite.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')

        navFind.classList.add('text-gray-600')
        navAdd.classList.add('text-gray-600')
        navFavorite.classList.add('text-gray-600')

        listRender.classList.remove('hidden')
        listRender.classList.add('flex')

        findRender.classList.remove('flex')
        addRender.classList.remove('flex')
        favoriteRender.classList.remove('flex')

        findRender.classList.add('hidden')
        addRender.classList.add('hidden')
        favoriteRender.classList.add('hidden')
    }
    
})

navAdd.addEventListener('click',e => {
    e.preventDefault()
    if (navAdd.classList.contains('text-gray-600')){
        navAdd.classList.remove('text-gray-600')
        navAdd.classList.add('text-indigo-700', 'underline', 'underline-offset-8')
        
        navFind.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
        navInfo.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
        navFavorite.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')

        navFind.classList.add('text-gray-600')
        navInfo.classList.add('text-gray-600')
        navFavorite.classList.add('text-gray-600')

        addRender.classList.remove('hidden')
        addRender.classList.add('flex')

        listRender.classList.remove('flex')
        findRender.classList.remove('flex')
        favoriteRender.classList.remove('flex')

        listRender.classList.add('hidden')
        findRender.classList.add('hidden')
        favoriteRender.classList.add('hidden')
    }
})

navFavorite.addEventListener('click',e => {
    e.preventDefault()
    if (navFavorite.classList.contains('text-gray-600')){
        navFavorite.classList.remove('text-gray-600')
        navFavorite.classList.add('text-indigo-700', 'underline', 'underline-offset-8')
        
        navFind.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
        navAdd.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')
        navInfo.classList.remove('text-indigo-700', 'underline', 'underline-offset-8')

        navFind.classList.add('text-gray-600')
        navAdd.classList.add('text-gray-600')
        navInfo.classList.add('text-gray-600')

        favoriteRender.classList.remove('hidden')
        favoriteRender.classList.add('flex')

        listRender.classList.remove('flex')
        findRender.classList.remove('flex')
        addRender.classList.remove('flex')

        listRender.classList.add('hidden')
        findRender.classList.add('hidden')
        addRender.classList.add('hidden')
    }
})