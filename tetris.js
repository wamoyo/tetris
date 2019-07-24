
var canvas = document.getElementById('tetris')
var context = canvas.getContext('2d')
var row = 20
var col = 10
var sq = 30
var vacant = 'white'

// Draw Square
function drawSquare (x, y, color) {
  context.fillStyle = color
  context.fillRect(x*sq, y*sq, sq, sq)

  context.strokeStyle = 'black'
  context.strokeRect(x*sq, y*sq, sq, sq)
}

drawSquare(0,0, 'blue')

// Create Board
var board = []
for (var r = 0; r < row; r += 1) {
  board[r] = []
  for (var c = 0; c < col; c += 1) {
    board[r][c] = vacant
  }
}

// Draw Board
function  drawBoard () {
  for (var r = 0; r < row; r += 1) {
    for (var c = 0; c < col; c += 1) {
      drawSquare(c, r, board[r][c])
    }
  }
}

drawBoard()

// The Pieces & Their Colors
var pieces = [
  [Z, 'red'],
  [S, 'green'],
  [T, 'yellow'],
  [O, 'blue'],
  [L, 'purple'],
  [I, 'cyan'],
  [J, 'orange']
]

// Initiate a Piece

var p = new Piece( pieces[0][0], pieces[0][1] )

// The Object Piece
function Piece (tetramino, color) {
  this.tetramino = tetramino
  this.color = color

  this.tetraminoN = 0
  this.activeTetramino = this.tetramino[this.tetraminoN]

  // control pieces
  this.x = 3
  this.y = 0

}

// Draw a Piece to the Board
Piece.prototype.fill = function (color) {
  for (var r = 0; r < this.activeTetramino.length; r += 1) {
    for (var c = 0; c < this.activeTetramino.length; c += 1) {
      // only draw occupied squares
      if (this.activeTetramino[r][c]) {
        drawSquare(this.x + c, this.y + r, color)
      }
    }
  }
}

// Draw a Piece to the Board
Piece.prototype.draw = function () {
  this.fill(this.color)
}

// Undraw a Piece to the Board
Piece.prototype.unDraw = function () {
  this.fill(vacant)
}

// Move Down
Piece.prototype.moveDown = function () {
  if (!this.collision(0, 1, this.activeTetramino)) {
    this.unDraw()
    this.y += 1
    this.draw()
  } else {
    // lock piece and generate new piece
  }
}

// Move Right
Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeTetramino)) {
    this.unDraw()
    this.x += 1
    this.draw()
  } else {
  }
}

// Move Left
Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeTetramino)) {
    this.unDraw()
    this.x -= 1
    this.draw()
  } else {
  }
}

// Rotate
Piece.prototype.rotate = function () {
  var nextPattern = this.tetramino[(this.tetraminoN + 1) % this.tetramino.length]
  var kick = 0

  if (this.collision(0, 0, nextPattern)) {
    if (this.x > col/2) {
      // It's the right wall
      kick = -1
    } else {
      kick = 1
      // It's the left wall
    }
  }

  if (!this.collision(kick, 0, nextPattern)) {
    this.unDraw()
    this.x += kick
    this.tetraminoN = (this.tetraminoN + 1) % this.tetramino.length
    this.activeTetramino = this.tetramino[this.tetraminoN]
    this.draw()
  } else {
  }
}

// Collision Detection
Piece.prototype.collision = function (x, y, piece) {
  for (var r = 0; r < piece.length; r += 1) {
    for (var c = 0; c < piece.length; c += 1) {
      // if the square is empty we skip it
      if (!piece[r][c]) continue
      // coordinates
      var newX = this.x + c + x
      var newY = this.y + r + y
      // conditions
      if (newX < 0 || newX >= col || newY >= row) {
        return true
      }
      // skip newY < 0 since board[-1] will crash game 
      if (newY < 0) continue
      // check for locked piece
      if (board[newY][newX] !== vacant){
        return true
      }
    }
  }
  return false
}

// Control The Piece
document.addEventListener('keydown', control)

function control (event) {
  if (event.keyCode === 37) {
    //dropStart = Date.now()
    p.moveLeft()
  } else if (event.keyCode === 38) {
    //dropStart = Date.now()
    p.rotate()
  } else if (event.keyCode === 39) {
    //dropStart = Date.now()
    p.moveRight()
  } else if (event.keyCode === 40) {
    //dropStart = Date.now()
    p.moveDown()
  }
}

// Drop Every Second
var dropStart = Date.now()

function drop () {
  var now = Date.now()
  var delta = now - dropStart
  if (delta > 1000) {
    p.moveDown()
    dropStart = Date.now()
  }
  requestAnimationFrame(drop)
}

drop()

