'use strict'

function onLevelsClick(click) {
    gGame.secsPassed = 0
    clearInterval(gIntervalSecs)
    gGame.lives = 3

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

    // const elLevels = document.querySelector('.levels')
    // elLevels.style.display = 'none'
    renderSubtitle()
    onInit()
}

function firstClick(row, col) {
    if (gGame.shownCount) return
    createsMines(gBoard)
    gGame.shownCount++

    gIntervalSecs = setInterval(getTimer, 1000)

    setMinesNegsCount(row, col)

    expandShown(row, col)
    renderBoard(gBoard, '.board-container')

}

function onCellClicked(elCell, row, col) {
    firstClick(row, col)
    gGame.shownCount++

    const currCell = gBoard[row][col]

    currCell.isShown = true
    currCell.minesAroundCount = null

    if (!gGame.isOn || currCell.minesAroundCount || currCell.isMarked) return

    setMinesNegsCount(row, col)

    elCell.style.backgroundColor = 'azure'

    if (currCell.minesAroundCount) elCell.innerText = currCell.minesAroundCount
    if (!currCell.minesAroundCount) expandShown(row, col)
    if (currCell.isMine) checkGameOver(elCell)
    checkWin()
}


function onCellMarked(event, elCell, i, j) {

    if (!gGame.isOn) return
    const currCell = gBoard[i][j]
    var mark = currCell.isMarked ? '' : '🚩'

    elCell.innerText = mark
    currCell.isMarked = !currCell.isMarked
    checkWin()
    event.preventDefault()
}

function smileyButton(click) {
    gGame.secsPassed = 0
    click.innerText = '😀'
    gGame.lives = 3
    renderSubtitle()
    onInit()
}

function safeClicks() {
    var cell = getSafeClicks()
    renderCell(cell, '😀')
    setTimeout()
}

function getSafeClicks() {
    gGame.safeClicks = true
    var safes = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMine) safes.push({ i, j })
        }
    }
    var idx = getRandomInt(0, safes.length)
    return safes[idx]
}