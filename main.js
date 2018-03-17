var board = new Array()
var score = 0

$(document).ready(function () {
  newgame()
})

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
    for (let j = 0; j < 4; j++) {
      board[i][j] = 0
    }
  }

  updataBoardView()
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
        theNumberCell.css('top', getPos(i) + 50) // 不显示的时候放在方格中心，动画好看
        theNumberCell.css('left', getPos(j) + 50)
      } else {
        theNumberCell.css('width', '100px')
        theNumberCell.css('height', '100px')
        theNumberCell.css('top', getPos(i))
        theNumberCell.css('left', getPos(j))
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]))
        theNumberCell.css('color', getNumberColor(board[i][j]))
        theNumberCell.text(board[i][j])
      }
    }
  }
}

function generateOneNumber() {
  if (nospace(board)) {
    return false
  }

  // 随机一个位置
  var randx = parseInt(Math.floor(Math.random() * 4))
  var randy = parseInt(Math.floor(Math.random() * 4))
  while (true) {
    if (board[randx][randy] === 0) {
      break
    }

    var randx = parseInt(Math.floor(Math.random() * 4))
    var randy = parseInt(Math.floor(Math.random() * 4))
  }
  // 随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4

  // 在随机位置显示随机数字
  board[randx][randy] = randNumber
  showNumberWithAnimation(randx, randy, randNumber)

  return true
}

$(document).keydown(function (event) {
  switch (event.keyCode) {
    case 37: // left
      if (moveLeft()){
        setTimeout(generateOneNumber, 210)
        setTimeout(isgameover(), 300) // gameover 要等 moveleft 中的 200 毫秒动画完成
      }
      break
      case 38:
      if (moveUp()){
        setTimeout(generateOneNumber, 210)
        setTimeout(isgameover(), 300)
      }
      break
      case 39:
      if (moveRight()){
        setTimeout(generateOneNumber, 210)
        setTimeout(isgameover(), 300)
      }
      break
      case 40:
      if (moveDown()){
        setTimeout(generateOneNumber, 210)
        setTimeout(isgameover(), 300)
      }
      break
    default:
      break
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
          } else if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board)) {
            // move
            showMoveAnimation(i, j, i, k)
            // add
            board[i][k] += board[i][j]
            board[i][j] = 0
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
          } else if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board)) {
            // move
            showMoveAnimation(i, j, k, j)
            // add
            board[k][j] += board[i][j]
            board[i][j] = 0
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
          } else if (board[i][k] === board[i][j] && noBlockHorizontalReverse(i, k, j, board)) {
            // move
            showMoveAnimation(i, j, i, k)
            // add
            board[i][k] += board[i][j]
            board[i][j] = 0
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
          } else if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board)) {
            // move
            showMoveAnimation(i, j, k, j)
            // add
            board[k][j] += board[i][j]
            board[i][j] = 0
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