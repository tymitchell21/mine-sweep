const game = document.querySelector('#game-wrap')
let begSize = document.querySelector('#size').value
console.log(begSize)
let numOfMines = document.querySelector('#mineNum')
numOfMines.value = begSize
numOfMines.min = begSize/2
numOfMines.max = begSize*5

// creates a single piece of maze
function createBox (row,box) {
    let newBox= document.createElement('div')
    let rowDest = document.getElementById(row)
    rowDest.appendChild(newBox)

    newBox.id = `[${row}][${box}]`
    newBox.classList.add('box')

    newBox.dataset.mines = 0;
}
// creates new row
function createRow (row) {
    let newRow = document.createElement('div')
    newRow.id = row
    newRow.classList.add('row')
    game.appendChild(newRow)
}

// uses dataset to randomly place mines throughout the board
function placeMines (size, minesNum) {
    for (let mines=0; mines<minesNum; mines++) {
        let ranNum1 = parseInt(Math.random() * (size) + 0);
        let ranNum2 = parseInt(Math.random() * (size) + 0);
        let cell = document.getElementById(`[${ranNum1}][${ranNum2}]`);
        if (cell.dataset.mines === 1) mines--;
        else cell.dataset.mines = 1
    }
}

// builds maze when start button is clicked
const createGame = function () {
    game.innerHTML = ''
    let size = document.querySelector('#size').value;
    let minesNum = document.querySelector('#mineNum').value;

    for (let row = 0; row < size; row++ ) {
        createRow(row);
        for (let box = 0; box < size; box++) {
            createBox(row, box);
        }
    }

    placeMines(size, minesNum);
}

document.querySelector('#start').addEventListener('click', function() {
    createGame()
})