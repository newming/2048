var board = new Array()
var score = 0

$(document).ready(function () {
  newgame()
})

function newgame() {
  // 初始化棋盘
  init()
  // 在随机两个格子生成数字
}

function init() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      var gridCell = $('#grid-cell-' + i + '-' + j)
      gridCell.css('top', getPos(i))
      gridCell.css('left', getPos(j))
    }
  }
}