'use strict'
var gBoard
var gIntervalSecs

const MINE_IMG = '💣'

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 2,
}


function onInit() {
    gGame.secsPassed = 0
    gGame.isOn = true
    gGame.shownCount = 0
    clearInterval(gIntervalSecs)

    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    gIntervalSecs = setInterval(getTimer, 1000)
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

function firstClick() {
    if (gGame.shownCount === 0) return
    // createsMines(gBoard)
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
    firstClick()
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
        elCell.innerText = MINE_IMG
        checkGameOver()
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
    const negs = []
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === row && j === col) continue

            if (gBoard[i][j].isMine) gBoard[row][col].minesAroundCount++
            negs.push({ i, j })
        }
    }
    return negs
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
            else if (!currCell.minesAroundCount) cellClass += ' no-negs'

            strHTML += `<td class="cell ${cellClass}"`

            strHTML += `onclick="onCellClicked(this,${i},${j})" 
                        oncontextmenu="onCellMarked(this,${i},${j})">`

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function onLevelsClick(click) {
    gGame.secsPassed = 0
    gGame.lives = 3
    clearInterval(gIntervalSecs)

    switch (click.innerText) {
        case 'Beginner':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            gGame.lives = 2
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

function checkGameOver() {
    gGame.lives--

    const elLife = document.querySelector('.life')
    const life = gGame.lives + '❤️'
    const dead = '🤍'

    elLife.innerText = life

    if (gGame.lives) return

    gGame.isOn = false

    elLife.innerText = dead

    const elMines = document.querySelectorAll('.mine')

    for (var i = 0; i < gLevel.MINES; i++) {
        elMines[i].innerText = MINE_IMG
    }
}



function getTimer() {
    const elTimer = document.querySelector('.timer')
    if (!gGame.isOn) return

    gGame.secsPassed++;
    elTimer.innerText = gGame.secsPassed
}



