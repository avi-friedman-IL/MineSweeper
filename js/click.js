'use strict'

function onLevelsClick(click) {
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

    renderSubtitle()
    onInit()
}

function firstClick(i, j) {
    if (gGame.shownCount) return
    gBoard[i][j].isShown = true
    gGame.shownCount++

    setMinesNegsCount(i, j)
    gIntervalSecs = setInterval(timer, 1000)
    expandShown(i, j)
    createsMines(gBoard)

    renderBoard(gBoard, '.board-container')
    renderCell({ i, j }, '')
}

function onCellClicked(elCell, i, j) {
    firstClick(i, j)
    gGame.shownCount++

    const currCell = gBoard[i][j]

    currCell.isShown = true
    currCell.minesAroundCount = ''

    if (!gGame.isOn || currCell.minesAroundCount || currCell.isMarked) return

    setMinesNegsCount(i, j)

    elCell.style.backgroundColor = 'azure'

    if (gGame.isHint ) ifIsHint(i, j)

    if (currCell.minesAroundCount) elCell.innerText = currCell.minesAroundCount
    if (!currCell.minesAroundCount) expandShown(i, j)
    if (currCell.isMine) checkGameOver(elCell)

    renderSubtitle()
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

function safeClicks(click) {
    if (!gGame.safeClicksCount) return
    gGame.safeClicksCount--

    click.style.color = getRandomColor()
    click.style.backgroundColor = getRandomColor()
    if (!gGame.safeClicksCount) click.style.opacity = 0

    var cell = getSafeClicks()
    renderCell(cell, '👌')

    setTimeout(() => {
        renderCell(cell, ' ')
    }, 1000)
    renderSubtitle()
}

function getSafeClicks() {
    const safes = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMine) safes.push({ i, j })
        }
    }
    const idx = getRandomInt(0, safes.length)
    return safes[idx]
}

function ifIsHint(i, j) {
    setTimeout(() => {
        gGame.isHint = false
        renderCell({ i, j }, EMPTY)
    }, 1000)
}

function onHintsClick(elClick) {
    
    if (!gGame.hintsCount) return
    gGame.hintsCount--
    elClick.innerText = '💡'
    gGame.isHint = !gGame.isHint
}
var gIsGameRules = false

function onGameRules(click) {
    const text = ` 
   מטרת המשחק היא לחשוף את כל התאים מבלי לפוצץ מוקשים שמסתתרים שם.

   ישנם 3 רמות למשחק 
   מתחיל 2 מוקשים
   בינוני 14 מוקשים
   מתקדם 32 מוקשים

   בלחיצה על תא יוצג מה מסתתר תחתיו. אם הוא ריק יוצגו כל התאים השכנים שלו עם מספר

   המספר נותן אינדיקציה כמה מוקשים נמצאים בשכנות לתא הממוספר

   יש 3 כפתורים של רמז שבלחיצה על כל אחד מהם ולאחר מכן לחיצה על תא תציג לשניה מה שתחתיו

   בנוסף לכך יש כפתור של לחיצה בטוחה שבלחיצה עליו יוצג לשניה תא שבטוח ללחיצה

   ניצחון: כאשר כל התאים חשופים והמוקשים מסומנים. הסימון מתבצע על ידי קליק ימני של העכבר
`
    gIsGameRules = !gIsGameRules
    const elGame = document.querySelector('.text')
    elGame.innerText = text
    elGame.style.display = gIsGameRules ? 'block' : 'none'

}