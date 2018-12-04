const game = document.querySelector('#game-wrap')
const smiley = document.querySelector('#smiley') 
const minesCounter = document.querySelector('#mines')
const timer = document.querySelector('#timer')

function countTimer() {
    ++totalSeconds;
    let hour = Math.floor(totalSeconds /3600);
    if (hour<10) hour = "0" + hour;
    let minute = Math.floor((totalSeconds - hour*3600)/60);
    if (minute<10) minute = "0" + minute;
    let seconds = totalSeconds - (hour*3600 + minute*60);
    if (seconds<10) seconds = "0" + seconds;
 
    document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}

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
    newBox.dataset.empty = 0;
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
function placeNums (size,boxes) {
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

// runs when box is clicked
function displayImages (e) {
    let currentBox = e.currentTarget

    if (currentBox.childElementCount>0) return
    
    if (currentBox.dataset.mines == 1) {
        displayLoss()
    } else if (currentBox.dataset.neighbors > 0) {
        currentBox.appendChild(createImg(`links/img/${currentBox.dataset.neighbors}.png`))
    } else {
        displayEmpty(currentBox, 0, 1)
    }
    currentBox.dataset.empty = 1

    let win = true
    const boxes = document.querySelectorAll('.box')
    boxes.forEach (box => {
        if (box.dataset.empty == 0) win=false
    })
    if (win) youWin()
}

function youWin () {
    alert('you win')
    clearTimeout(myTimer);
}

// empties surrounding empty spaces
function displayEmpty (node, target, replacement) {
    if (node.dataset.empty == replacement) return
    if (node.dataset.neighbors != target) return
    node.appendChild(createImg('links/img/tile.png'))
    node.dataset.empty = 1

    let size = document.querySelector('#size').value
    let relativeRow = parseInt(node.dataset.row)
    let boxIndex = parseInt(node.dataset.box)
    for (let i = relativeRow-1; i<=relativeRow+1; i++) {
        for (let j = boxIndex-1; j<=boxIndex+1; j++) {
            if (j<0 || i<0 || j>=size || i>=size) continue
            if (i == relativeRow && j == boxIndex) continue

            let neighborBox = document.getElementById(`[${i}][${j}]`)

            displayEmpty(neighborBox, target, replacement)
        }
    }
    return
}

function displayLoss() {
    const boxes = document.querySelectorAll('.box')
    boxes.forEach (box => {
        box.removeEventListener('click', displayImages)
        box.removeEventListener('contextmenu', displayFlag)

        if (box.dataset.mines == 1) {
            if (box.childElementCount>0){
                box.removeChild(box.lastElementChild)
            } 
            box.appendChild(createImg('links/img/bomb.png'))
        }
    })
    smiley.src = "links/img/sad"

    clearTimeout(myTimer);
}

function createImg (img) {
    let image = document.createElement('img')
    image.src = img
    return image
}

// runs when box is clicked
function displayFlag (e) {
    e.preventDefault();

    let currentBox = e.currentTarget;
    let currentValue = currentBox.innerHTML;
    let minesNum = parseInt(minesCounter.innerHTML)

    if (currentValue == '') {
        currentBox.appendChild(createImg('links/img/flag.png'));
        minesNum--
    }
    else {
        currentBox.innerHTML = '';
        minesNum++
    }

    minesCounter.innerHTML = minesNum
    currentBox.dataset.empty = 1
}

// builds maze when start button is clicked
const createGame = function () {
    game.innerHTML = '';
    let size = document.querySelector('#size').value;
    let minesNum = document.querySelector('#mineNum').value;
    smiley.src = "links/img/smiley"
    minesCounter.innerHTML = minesNum;

    for (let row = 0; row < size; row++ ) {
        createRow(row);
        for (let box = 0; box < size; box++) {
            createBox(row, box);
        }
    }

    const boxes = document.querySelectorAll('.box')
    boxes.forEach (box => {
        box.addEventListener('click', displayImages)
        box.addEventListener('contextmenu', displayFlag)
    })

    totalSeconds = 0;
    clearInterval(myTimer);
    myTimer = setInterval(countTimer, 1000);

    placeMines(size, minesNum);
    placeNums(size, boxes);
}

document.querySelector('#start').addEventListener('click', function() {
    createGame();
})

let totalSeconds = 0;
let myTimer