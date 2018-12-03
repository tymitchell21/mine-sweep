const game = document.querySelector('#game-wrap')
let begSize = document.querySelector('#size').value
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
    newBox.dataset.row = row;
    newBox.dataset.box = box;
    newBox.dataset.neighbors = 0;
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
        if (cell.dataset.mines == 1) mines--;
        else cell.dataset.mines = 1;
    }
}

// keeps track of number of neighbor mines for each box
function placeNums (size) {
    let boxes = document.querySelectorAll('.box')
    boxes.forEach (box => {
        let relativeRow = parseInt(box.dataset.row)
        let boxIndex = parseInt(box.dataset.box)
        if (box.dataset.mines === '1') {
            for (let i = relativeRow-1; i<=relativeRow+1; i++) {
                for (let j = boxIndex-1; j<=boxIndex+1; j++) {
                    if (j<0 || i<0 || j>=size || i>=size) continue
                    if (i == relativeRow && j == boxIndex) continue

                    let neighborBox = document.getElementById(`[${i}][${j}]`)
                    neighborBox.dataset.neighbors++
                }
            }
        }
    })
}

// places the images in box
function placeImages () {
    let boxes = document.querySelectorAll('.box')
    boxes.forEach (box => {
        if (box.dataset.mines == 1) {
            box.innerHTML = 'B'
        } else if (box.dataset.neighbors == 0) {
            box.innerHTML = ''
        } else {
            box.innerHTML = box.dataset.neighbors
        }
    })
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
    placeNums(size)
    placeImages()
}

document.querySelector('#start').addEventListener('click', function() {
    createGame()
})