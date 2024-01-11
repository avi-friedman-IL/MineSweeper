'use strict'
var gBoard
var gIntervalSecs

const EMPTY = ' '
const MINE_IMG = '💣'

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    isHint: false,
    isMegaHint: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hintsCount: 3,
    lives: 2,
    safeClicksCount: 3,
    megaHintCount: 0,
    leftClick: null
}

function onInit() {
    restartButtons()
    restartGame()
    renderSubtitle()
    clearInterval(gIntervalSecs)

    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
}

function restartGame() {
    gGame.lives = gLevel.SIZE === 4 ? 2 : 3
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gGame.safeClicksCount = 3
    gGame.hintsCount = 3
    gGame.megaHintCount = 0
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
    return board
}

function createMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {

        var rowIdx = getRandomInt(0, gLevel.SIZE)
        var colIdx = getRandomInt(0, gLevel.SIZE)

        const currCell = board[rowIdx][colIdx]
        if (!currCell.isMine && !currCell.isShown) currCell.isMine = true
        else i -= 1
    }
}

function setMinesNegsCount(row, col) {

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j >= gBoard[0].length) continue
            if (i === row && j === col) continue

            if (gBoard[i][j].isMine) gBoard[row][col].minesAroundCount++
        }
    }
}

function expandShown(row, col) {
    checkWin()

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = col - 1; j <= col + 1; j++) {
            const currCell = gBoard[i][j]

            if (j < 0 || j >= gBoard[0].length) continue
            if (i === row && j === col || currCell.isMarked) continue

            if (!gGame.isHint && !currCell.isShown && !gGame.isMegaHint) {
                currCell.isShown = true
                gGame.shownCount++
            }

            renderCell({ i, j }, currCell.minesAroundCount)
        }
    }
    if (gGame.isHint) {
        setTimeout(() => {
            for (var i = row - 1; i <= row + 1; i++) {
                if (i < 0 || i >= gBoard.length) continue

                for (var j = col - 1; j <= col + 1; j++) {
                    const currCell = gBoard[i][j]
                    if (j < 0 || j >= gBoard[0].length) continue
                    if (i === row && j === col || currCell.isMarked) continue
                    if (currCell.isShown) continue

                    renderCell({ i, j }, EMPTY)
                }
            }
        }, 1000)
    }
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
    elCell.style.backgroundColor = (value === EMPTY) ? 'rgb(155, 205, 249)' : 'azure'
}

function renderSubtitle() {
    const live = gGame.lives + '❤️'
    const dead = gGame.lives + '🤍'

    const elLiveContainer = document.querySelector('.lives')
    const elTimer = document.querySelector('.timer')
    const elSafe = document.querySelector('.safe')
    const elWin = document.querySelector('.win')

    elLiveContainer.innerText = gGame.lives ? live : dead
    elTimer.innerText = gGame.secsPassed
    elSafe.innerText = gGame.safeClicksCount
    elWin.style.display = 'none'

}

function restartButtons() {
    const elSafeClicks = document.querySelector('.safe-clicks')
    const elMegaHint = document.querySelector('.mega-hint')
    const elHints = document.querySelectorAll('.hints')

    elSafeClicks.style.opacity = 1
    elMegaHint.style.opacity = 1
    for (var i = 0; i < 3; i++) {
        elHints[i].innerText = '🔍'
    }
}

function renderMegaHint() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

        }
    }
}

function checkGameOver(elCell) {
    const elSmileyButton = document.querySelector('.smiley-button')
    if (!gGame.isHint) gGame.lives--
    elCell.innerText = MINE_IMG

    renderSubtitle()

    if (!gGame.lives) checkLose()
    else checkWin()
    elSmileyButton.innerText = gGame.lives ? '😀' : '🙁'
}

function checkLose() {
    const elMines = document.querySelectorAll('.mine')
    gGame.isOn = false

    renderSubtitle()

    for (var i = 0; i < gLevel.MINES; i++) {
        elMines[i].innerText = MINE_IMG
    }

}

function checkWin() {
    if (!gGame.isOn) return
    const elSmileyButton = document.querySelector('.smiley-button')
    const elWin = document.querySelector('.win')

    const winMsg = `win!!! \n 🎉 \n seconds:${gGame.secsPassed}`

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMarked) return false
        }
    }
    clearInterval(gIntervalSecs)

    elWin.style.display = 'block'
    elWin.innerText = winMsg
    elSmileyButton.innerText = '💯'
    gGame.isOn = false
}


function timer() {
    if (!gGame.isOn) return
    const elTimer = document.querySelector('.timer')

    gGame.secsPassed++;
    elTimer.innerText = gGame.secsPassed
}

function onNightModeClick(click) {
    const normal = 'Normal mode'
    const dark = 'Dark mode'

    const elBody = document.querySelector('body')
    
    if (click.innerText === normal) {
        elBody.style.backgroundColor = 'rgb(222, 206, 186)'
        click.innerText = dark
    } else {
        elBody.style.backgroundColor = 'rgb(96, 28, 28)'
        click.innerText = normal
    }
}

