'use strict'
var gBoard

const MINE_IMG = '💣'

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: null
}


function onInit() {
    gGame.isOn = true
    gGame.shownCount = 0
    renderLevels()
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    gGame.secsPassed = setInterval(getTimer, 1000)
}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    createsMines(board)
    return board
}

function createsMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var boardI = getRandomInt(0, gLevel.SIZE)
        var boardJ = getRandomInt(0, gLevel.SIZE)
        
        if (!board[boardI][boardJ].isMine) board[boardI][boardJ].isMine = true
        else i -= 1
    }
}



function onCellClicked(elCell, row, col) {
    
    const currCell = gBoard[row][col]


    currCell.isShown = true
    currCell.minesAroundCount = null

    if (!gGame.isOn) return
    if (currCell.minesAroundCount > 0) return
    if (currCell.isMarked) return

    elCell.style.backgroundColor = 'azure'
    
    setMinesNegsCount(row, col)
    
    gGame.shownCount++

    if (currCell.minesAroundCount) elCell.innerText = currCell.minesAroundCount

    if (!currCell.minesAroundCount) expandShown(row, col)

    if (currCell.isMine) {
        elCell.innerHTML = MINE_IMG
        gameOver()
    }
}

function expandShown(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j >= gBoard[0].length) continue
            if (i === row && j === col || gBoard[i][j].isMarked) continue

            renderCell({ i, j }, gBoard[i][j].minesAroundCount)
        }
    }
}

function setMinesNegsCount(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === row && j === col) continue

            if (gBoard[i][j].isMine) {
                gBoard[row][col].minesAroundCount++
            }
        }
    }
}

function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const currCell = mat[i][j]

            setMinesNegsCount(i, j)

            var cellClass = getClassName({ i, j })

            if (gBoard[i][j].isMine) cellClass += ' mine'
            else if (currCell.minesAroundCount === 0) cellClass += ' no-negs'

            strHTML += `<td class="cell ${cellClass}"`


            strHTML += `onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,${i},${j})">`

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function renderLevels() {
    var strHTML = `
    
        <div class="level beginner" onclick="onLevelsClick(this)">Beginner</div> 
        <div class="level medium" onclick="onLevelsClick(this)">Medium</div>
        <div class="level expert" onclick="onLevelsClick(this)">Expert</div>
        `
    const elLevels = document.querySelector('.levels')
    elLevels.innerHTML = strHTML
}

function onLevelsClick(click) {
    switch (click.innerText) {
        case 'Beginner':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break;
        case 'Medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break;
        case 'Expert':
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break;
    }
    onInit()
}

function onCellMarked(elCell, i, j) {
    const currCell = gBoard[i][j]
    var mark = currCell.isMarked ? '' : '🚩'

    elCell.innerText = mark
    currCell.isMarked = !currCell.isMarked
}

function gameOver() {
    gGame.isOn = false
    clearInterval(gGame.secsPassed)

    const elGameOver = document.querySelector('.game-over')
    const elMines = document.querySelectorAll('.mine')

    for (var i = 0; i < gLevel.MINES; i++) {
        elMines[i].innerText = MINE_IMG
    }

    elGameOver.innerText = 'game over! :('
}
