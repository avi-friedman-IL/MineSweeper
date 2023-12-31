'use strict'

const MINE_IMG = '☼'

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard

alert('Note! This is a preliminary version only!')

function onInit() {
    renderLevels()
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
        }
    }
    
    for (let i = 0; i < gLevel.MINES; i++) {
        board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)].isMine = true
    }
    return board
}

function onCellClicked(elCell, row, col) {
    gBoard[row][col].minesAroundCount = 0

    if (gBoard[row][col].minesAroundCount > 0) return


    setMinesNegsCount(row, col)

    if (gBoard[row][col].minesAroundCount) elCell.innerText = gBoard[row][col].minesAroundCount

    if (!gBoard[row][col].minesAroundCount) expandShown(row, col)

    if (gBoard[row][col].isMine) elCell.innerHTML = MINE_IMG
}

function expandShown(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === row && j === col) continue

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
            if (currCell.isMine) cellClass += ' mine'
            else if (currCell.minesAroundCount === 0) cellClass += ' nonegs'

            strHTML += `<td class="cell ${cellClass}"`


            strHTML += `onclick="onCellClicked(this,${i},${j})">`


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
    Select a game level!
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
