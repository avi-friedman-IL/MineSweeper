'use strict'

function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            setMinesNegsCount(i, j)

            var cellClass = getClassName({ i, j })

            if (gBoard[i][j].isMine) cellClass += ' mine'

            strHTML += `<td class="cell ${cellClass}"`
            strHTML += `onclick="onCellClicked(this,${i},${j})`
            strHTML += `,onMegaHintCellClick(this,${i},${j})`
            strHTML += `"`
            strHTML += `oncontextmenu="onCellMarked(event,this,${i},${j})">`
            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function getClassName(position) {
    const className = `cell-${position.i}-${position.j}`
    return className
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

