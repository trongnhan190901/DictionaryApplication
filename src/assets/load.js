const BinarySearchTree = require('../core/BinarySearchTree.js')
const fs = require('fs');
const path = require('path');

const customCompare = (wordA, wordB) => {
    if (wordA?.word === wordB?.word){ return 0 };
    return wordA?.word < wordB?.word ? -1 : 1;
}

function ReadFile(character) {
    try {
        const rawData = fs.readFileSync(path.join(
            __dirname,
            `../data`,
            `${character}.json`
        ))
        const wordData = JSON.parse(rawData)
        return wordData
    } catch (error) {
        console.log('Error', error)
    }
}

const init = (character) => {
    const words = ReadFile(character);
    console.log(words.length + " " + character);
    const tree = new BinarySearchTree(customCompare)
    tree.insert(words[Math.floor(words.length / 2)])
    let x = Math.floor(words.length / 2) - 1;
    for (let y = Math.floor(words.length / 2) + 1; y < words.length; y++) {
        if (words[x]) tree.insert(words[x])
        if (words[y]) tree.insert(words[y])
        x--;
    }
    return tree
}
module.exports = { init }

