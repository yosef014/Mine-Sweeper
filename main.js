var gBoard = []
var gLevel = { size: 4, boombs: 3 }
var gGame = {}
var intervalTime

const BOOMB = '💣'
const flag = '🚩'


function init() {
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, life: 3 }

    buildBoard(gLevel.size)
    renderBoard()
}


function buildBoard(size) {

    for (var i = 0; i < size; i++) {
        gBoard[i] = []
        for (var j = 0; j < size; j++) {
            gBoard[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isBoomb: false,
                isMarked: false,
                neighboors: 0
            }
        }

    }
    putBoombs()
    console.table(gBoard)
}

function putBoombs() {
    for (var i = 0; i < gLevel.boombs; i++) {
        var emptyCells = getEmptyCell()
        var randomCell = emptyCells[getRandomInt(0, emptyCells.length)]
        gBoard[randomCell.i][randomCell.j].isBoomb = true
        console.log(gBoard[randomCell.i][randomCell.j])
    }
}

function getEmptyCell() {
    var emptyCellsArr = []
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {

            if (!gBoard[i][j].isBoomb) {
                emptyCellsArr.push({ i: i, j: j })
            }
        }
    }
    return emptyCellsArr
}


function renderBoard() {
    var elBoard = document.querySelector('table')
    var strHtml = ''
    for (var i = 0; i < gLevel.size; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].neighboors = neighborsBoombsCounter(i, j)
            var tdShow = ''
            var className = ''
            className = (gBoard[i][j].isShown) ? 'shown' : 'close'

            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].isBoomb) {
                    tdShow = BOOMB
                } else {
                    tdShow = gBoard[i][j].neighboors

                }
            }
            if (gBoard[i][j].isMarked && !gBoard[i][j].isShown) tdShow = flag
            strHtml += `<th class="cell cell-${i}-${j} ${className}" oncontextmenu="putFlag(this,${i},${j})" onclick="tdClicked(this ,${i},${j})">${tdShow}</th>`
        }
        strHtml += '</tr>'
        elBoard.innerHTML = strHtml
        checkGameOver()
    }
}


function tdClicked(thisTd, currI, currJ) {
    if (!gGame.isOn) {
        intervalTime = setInterval(setTime, 1000);
        gGame.isOn = true
    }
    if (gBoard[currI][currJ].isMarked) return
    if (gBoard[currI][currJ].isBoomb) {
        var elTd = document.querySelector(`.cell-${currI}-${currJ}`)
        if (elTd.classList.contains('close')) {
            elTd.classList.remove('close')
            elTd.classList.add('shown')
            gBoard[currI][currJ].isShown = true
        }
        renderBoard()
        showAllBoombs()
    } else {
        for (var i = currI - 1; i <= currI + 1; i++) {
            for (var j = currJ - 1; j <= currJ + 1; j++) {
                if (i < 0 || i > gLevel.size - 1) continue
                if (j < 0 || j > gLevel.size - 1) continue

                var elTd = document.querySelector(`.cell-${i}-${j}`)
                if (gBoard[i][j].isBoomb) continue
                if (gBoard[i][j].isMarked) continue

                if (elTd.classList.contains('close')) {
                    elTd.classList.remove('close')
                    elTd.classList.add('shown')
                    gBoard[i][j].isShown = true

                }
                renderBoard()
            }
        }
    }
}


function neighborsBoombsCounter(currI, currJ) {
    var boombCounter = 0
    for (var i = currI - 1; i <= currI + 1; i++) {
        for (var j = currJ - 1; j <= currJ + 1; j++) {
            if (i === currI && j === currJ) continue
            if (i < 0 || i > gLevel.size - 1) continue
            if (j < 0 || j > gLevel.size - 1) continue
            if (gBoard[i][j].isBoomb) boombCounter++
        }
        if (boombCounter === 0) boombCounter = ''
    }
    return boombCounter
}


function btClicked(elBt, size, boombsNumber) {
    gLevel.size = size
    gLevel.boombs = boombsNumber
    document.querySelector('table').innerHTML = ''
    init()

}
function putFlag(elTd, i, j) {
    window.event.preventDefault()
    if (!gGame.isOn) {
        intervalTime = setInterval(setTime, 1000);
        gGame.isOn = true
    }

    gBoard[i][j].isMarked = (gBoard[i][j].isMarked) ? false : true
    renderBoard()


}

function checkGameOver() {
    var counter = 0
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isBoomb && gBoard[i][j].isMarked) {
                counter++
            }
        }
    }

    if (counter === gLevel.boombs) gameover()
}


function gameover() {
    clearInterval(intervalTime);
    document.querySelector('.icon').innerText = '😎'


}

function showAllBoombs() {
    gGame.life--
    gLevel.boombs--
    document.querySelector('.lives').innerText = '💓'
    for (var i = 0; i < gGame.life - 1; i++) {
        document.querySelector('.lives').innerText += '💓'
    }
    if (!gGame.life) {
        document.querySelector('.lives').innerText = ''

        for (var i = 0; i < gLevel.size; i++) {
            for (var j = 0; j < gLevel.size; j++) {
                if (gBoard[i][j].isBoomb)
                    document.querySelector(`.cell-${i}-${j}`).innerText = BOOMB
            }
        }
        document.querySelector('.icon').innerText = '🥵'
        clearInterval(intervalTime);

    }
}

function restart() {
    clearInterval(intervalTime);
    minutesLabel.innerText = '00'
    secondsLabel.innerText = '00'
    document.querySelector('.icon').innerText = '😀'
    init()
}






















var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");

function setTime() {
    ++gGame.secsPassed;
    secondsLabel.innerHTML = pad(gGame.secsPassed % 60);
    minutesLabel.innerHTML = pad(parseInt(gGame.secsPassed / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}