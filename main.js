var board = new Array()
var score = 0
var hasConflicted = new Array() // 记录是否已经发生过碰撞

var startx = 0
var starty = 0
var endx = 0
var endy = 0

$(document).ready(function () {
  prepareForMobile()
  newgame()
})

function prepareForMobile() {
  $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace)
  $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace)
  $('#grid-container').css('padding', cellSpace)
  $('#grid-container').css('border-radius', 0.02 * gridContainerWidth)

  $('.grid-cell').css('width', cellSideLength)
  $('.grid-cell').css('height', cellSideLength)
  $('.grid-cell').css('border-radius', 0.02 * cellSideLength)
}

function newgame() {
  // 初始化棋盘
  init()
  // 在随机两个格子生成数字
  generateOneNumber()
  generateOneNumber()
}

function init() {
  // 将格子放到对应的位置
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      var gridCell = $('#grid-cell-' + i + '-' + j)
      gridCell.css('top', getPos(i))
      gridCell.css('left', getPos(j))
    }
  }
  // 将 board 初始化为二维数组
  for (let i = 0; i < 4; i++) {
    board[i] = new Array()
    hasConflicted[i] = new Array()
    for (let j = 0; j < 4; j++) {
      board[i][j] = 0
      hasConflicted[i][j] = false
    }
  }

  updataBoardView()

  score = 0
}

function updataBoardView() {
  // 每次更新都会删除所有的数字方格
  $('.number-cell').remove()

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      $('#grid-container').append(`<div class='number-cell' id='number-cell-${i}-${j}'></div>`)
      var theNumberCell = $('#number-cell-' + i + '-' + j)

      if (board[i][j] === 0) {
        theNumberCell.css('width', '0px')
        theNumberCell.css('height', '0px')
        theNumberCell.css('top', getPos(i) + cellSideLength / 2) // 不显示的时候放在方格中心，动画好看
        theNumberCell.css('left', getPos(j) + cellSideLength / 2)
      } else {
        theNumberCell.css('width', cellSideLength)
        theNumberCell.css('height', cellSideLength)
        theNumberCell.css('top', getPos(i))
        theNumberCell.css('left', getPos(j))
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]))
        theNumberCell.css('color', getNumberColor(board[i][j]))
        theNumberCell.text(board[i][j])
      }
      // 每次更新后重新计算碰撞
      hasConflicted[i][j] = false
    }
  }
  $('.number-cell').css('line-height', cellSideLength + 'px')
  $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px')
}

function generateOneNumber() {
  if (nospace(board)) {
    return false
  }

  // 随机一个位置
  var randx = parseInt(Math.floor(Math.random() * 4))
  var randy = parseInt(Math.floor(Math.random() * 4))

  var times = 0 // 随机生成位子尝试的次数，大于50次后，人工选取一个
  while (times < 50) {
    if (board[randx][randy] === 0) {
      break
    }

    var randx = parseInt(Math.floor(Math.random() * 4))
    var randy = parseInt(Math.floor(Math.random() * 4))

    times ++
  }

  if (times === 50) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          randx = i
          randy = j
        }
      }
    }
  }

  // 随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4

  // 在随机位置显示随机数字
  board[randx][randy] = randNumber
  showNumberWithAnimation(randx, randy, randNumber)

  isgameover()

  return true
}

$(document).keydown(function (event) {
  switch (event.keyCode) {
    case 37: // left
      event.preventDefault() // 当有滚动条的时候，网页会滚动，阻止了
      if (moveLeft()){
        setTimeout(generateOneNumber, 250)
        // 发现放到这里有问题， generateOneNumber 到后边比较费时间，isgameover 会先执行了，所以拿到了 generateOneNumber 中，需要改成异步
        // setTimeout(isgameover(), 350) // gameover 要等 moveleft 中的 200 毫秒动画完成
      }
      break
    case 38:
      event.preventDefault() // 当有滚动条的时候，网页会滚动，阻止了
      if (moveUp()){
        setTimeout(generateOneNumber, 250)
        // setTimeout(isgameover(), 350)
      }
      break
    case 39:
      event.preventDefault() // 当有滚动条的时候，网页会滚动，阻止了
      if (moveRight()){
        setTimeout(generateOneNumber, 250)
        // setTimeout(isgameover(), 350)
      }
      break
    case 40:
      event.preventDefault() // 当有滚动条的时候，网页会滚动，阻止了
      if (moveDown()){
        setTimeout(generateOneNumber, 250)
        // setTimeout(isgameover(), 350)
      }
      break
    default:
      break
  }
})

document.addEventListener('touchstart', function(event) {
  startx = event.touches[0].pageX
  starty = event.touches[0].pageY
})

document.addEventListener('touchmove', function (event) {
  event.preventDefault()
}, isPassive() ? {
  capture: false,
  passive: false
} : false)

document.addEventListener('touchend', function(event) {
  endx = event.changedTouches[0].pageX
  endy = event.changedTouches[0].pageY

  var deltax = endx - startx
  var deltay = endy - starty

  if (Math.abs(deltax) < 50 && Math.abs(deltay) < 50) {
    return
  }

  // x
  if (Math.abs(deltax) >= Math.abs(deltay)) {
    if (deltax > 0) {
      // move right
      if (moveRight()){
        setTimeout(generateOneNumber, 250)
      }
    } else {
      // move left
      if (moveLeft()){
        setTimeout(generateOneNumber, 250)
      }
    }
  } else {
    // y
    if (deltay > 0) {
      // down
      if (moveDown()){
        setTimeout(generateOneNumber, 250)
      }
    } else {
      // up
      if (moveUp()){
        setTimeout(generateOneNumber, 250)
      }
    }
  }
})

function isgameover() {
  // 没有空间并且都不能移动时结束
  if (nospace(board) && nomove(board)) {
    gameover()
  }
}

function gameover() {
  alert('游戏结束')
}

function moveLeft() {
  if (!canMoveLeft(board)) {
    return false
  }

  // 开始进行移动
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (board[i][j] !== 0) {
        for (let k = 0; k < j; k++) {
          // 如果左边的为空，并且之间没有障碍物
          if (board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
            // move
            showMoveAnimation(i, j, i, k)
            board[i][k] = board[i][j]
            board[i][j] = 0
            continue
          } else if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
            // move
            showMoveAnimation(i, j, i, k)
            // add
            board[i][k] += board[i][j] // 当出现叠加的时候会进行分数的增加
            board[i][j] = 0
            score += board[i][k]
            updateScore(score)

            hasConflicted[i][k] = true
            continue
          }
        }
      }
    }
  }

  setTimeout(updataBoardView, 200)

  return true
}

function moveUp() {
  if (!canMoveUp(board)) {
    return false
  }

  // 开始进行移动
  for (let j = 0; j < 4; j++) {
    for (let i = 1; i < 4; i++) {
      if (board[i][j] !== 0) {
        for (let k = 0; k < i; k++) {
          if (board[k][j] === 0 && noBlockVertical(j, k, i, board)) {
            // move
            showMoveAnimation(i, j, k, j)
            board[k][j] = board[i][j]
            board[i][j] = 0
            continue
          } else if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
            // move
            showMoveAnimation(i, j, k, j)
            // add
            board[k][j] += board[i][j]
            board[i][j] = 0
            score += board[k][j]
            updateScore(score)

            hasConflicted[k][j] = true
            continue
          }
        }
      }
    }
  }

  setTimeout(updataBoardView, 200)

  return true
}

function moveRight() {
  if (!canMoveRight(board)) {
    return false
  }

  // 开始进行移动
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      if (board[i][j] !== 0) {
        for (let k = 3; k > j; k--) {
          if (board[i][k] === 0 && noBlockHorizontalReverse(i, k, j, board)) {
            // move
            showMoveAnimation(i, j, i, k)
            board[i][k] = board[i][j]
            board[i][j] = 0
            continue
          } else if (board[i][k] === board[i][j] && noBlockHorizontalReverse(i, k, j, board) && !hasConflicted[i][k]) {
            // move
            showMoveAnimation(i, j, i, k)
            // add
            board[i][k] += board[i][j]
            board[i][j] = 0
            score += board[i][k]
            updateScore(score)

            hasConflicted[i][k] = true
            continue
          }
        }
      }
    }
  }

  setTimeout(updataBoardView, 200)

  return true
}

function moveDown() {
  if (!canMoveDown(board)) {
    return false
  }

  // 开始进行移动
  for (let j = 0; j < 4; j++) {
    for (let i = 2; i >= 0; i--) {
      if (board[i][j] !== 0) {
        for (let k = 3; k > i; k--) {
          if (board[k][j] === 0 && noBlockVerticalReverse(j, k, i, board)) {
            // move
            showMoveAnimation(i, j, k, j)
            board[k][j] = board[i][j]
            board[i][j] = 0
            continue
          } else if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
            // move
            showMoveAnimation(i, j, k, j)
            // add
            board[k][j] += board[i][j]
            board[i][j] = 0
            score += board[k][j]
            updateScore(score)

            hasConflicted[k][j] = true
            continue
          }
        }
      }
    }
  }
  // 移动时有个动画的200毫秒
  setTimeout(updataBoardView, 200)

  return true
}