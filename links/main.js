const game = document.querySelector('#game-wrap')

// creates a single piece of maze
function createBox (row) {
    let newBox= document.createElement('div')
    let rowDest = document.getElementById(row)
    rowDest.appendChild(newBox)

    newBox.classList.add('box')
}

// creates new row
function createRow (row) {
    let newRow = document.createElement('div')
    newRow.id = row
    newRow.classList.add('row')
    game.appendChild(newRow)
}

// builds maze when start button is clicked
const createGame = function () {
    game.innerHTML = ''
    let size = 10;

    for (let row = 0; row < size; row++ ) {
        createRow(row)
        for (let box = 0; box < size; box++) {
            createBox(row)
        }
    }

}

createGame() 