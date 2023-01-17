'use strict'



const board = document.querySelector('.chess-board');
const allCells = document.querySelectorAll('.cell')
const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
let piecesInBoard = new Map()
const timer = document.querySelector('.time')

// generate id for each cell
allCells.forEach((cell, idx)=> {
 const row = Number.parseInt(idx / 8);
 const col = idx % 8;
 cell.id = `${alphabets[col]}${row + 1}`
})


class Piece{
  constructor(owner, position, type){
    this._owner = owner;
    this._type = type;
    this.position = position;
  }
  
  _updatePosition(pos){
    // if position property is not null, go remove it from the older place and put it in the new pos
    this._position && document.getElementById(this._position).querySelector('img')?.remove()
    piecesInBoard.delete(this._position)
    this._position = pos;
    piecesInBoard.set(this._position,this)
    document.getElementById(this._position).insertAdjacentHTML("afterbegin", 
    `<img src=Images/${this._owner == 'w' ? 'White' : 'Black'}-${this._type}.svg>`)
  }

  remove(){
    document.getElementById(this._position).querySelector('img').remove()
    piecesInBoard.delete(this.position);    
  }

  static removeInvalidPositions(positions){
    for(let i of positions){
      if(i.length === 3 || i== null || i == undefined || String(i).charAt(1) === '9' || String(i).charAt(1) === '0')
        positions.delete(i)
    }

  }
  get owner(){
    return this._owner;
  }
  get position(){
    return this._position
  }
  get type(){
    return this._type;
  }
  setPosition(newPosition){
    this._position = newPosition;
  }
  calcPossibleMoves(){
      console.log('MUST BE OVERRIDEN IN CHILDREN')
  }
}

class Pawn extends Piece{
  
  constructor(owner, position){
    super(owner, position, 'Pawn')
    this._firstMove = true;
  }
  
  set position(pos){
    this._firstMove = false
    this._updatePosition(pos)
  }
  get position(){
    return this._position;
  }
  get type(){
    return this._type;
  }
  get owner(){
    return this._owner;
  }

  calcPossibleMoves(){
    let curPos = this._position;
    const possibleMoves = new Set();
    if(this._owner == 'b'){

      //check forward 
      const curRow = Number(curPos.charAt(1))
      const curColumn = curPos.charAt(0)
      let absolutePosition1 = curColumn + (curRow + 1)
      !piecesInBoard.get(absolutePosition1) && possibleMoves.add(absolutePosition1);
      let absolutePosition2 = curColumn + (curRow + 2)
      this._firstMove && !piecesInBoard.get(absolutePosition1) && !piecesInBoard.get(absolutePosition2) &&possibleMoves.add(absolutePosition2);
      const nextColumn = alphabets[curColumn.charCodeAt(0) - 'a'.charCodeAt(0) + 1];
      const prevColumn = alphabets[curColumn.charCodeAt(0) - 'a'.charCodeAt(0) - 1];
      let absolutePosition3 = nextColumn + (curRow + 1)
      let absolutePosition4 = prevColumn + (curRow + 1)
      piecesInBoard.get(absolutePosition3) && piecesInBoard.get(absolutePosition3).owner !== this._owner && possibleMoves.add(absolutePosition3)
      piecesInBoard.get(absolutePosition4) && piecesInBoard.get(absolutePosition4).owner !== this._owner && possibleMoves.add(absolutePosition4)
      
    }
    else{
      const curRow = Number(curPos.charAt(1))
      const curColumn = curPos.charAt(0)
      let absolutePosition1 = curColumn + (curRow - 1)
      !piecesInBoard.get(absolutePosition1) && possibleMoves.add(absolutePosition1);
      let absolutePosition2 = curColumn + (curRow - 2)
      this._firstMove && !piecesInBoard.get(absolutePosition1)&& !piecesInBoard.get(absolutePosition2) &&  possibleMoves.add(absolutePosition2);
      const nextColumn = alphabets[curColumn.charCodeAt(0) - 'a'.charCodeAt(0) + 1];
      const prevColumn = alphabets[curColumn.charCodeAt(0) - 'a'.charCodeAt(0) - 1];
      let absolutePosition3 = nextColumn + (curRow - 1)
      let absolutePosition4 = prevColumn + (curRow - 1)
      piecesInBoard.get(absolutePosition3) && piecesInBoard.get(absolutePosition3).owner !== this._owner && possibleMoves.add(absolutePosition3)
      piecesInBoard.get(absolutePosition4) && piecesInBoard.get(absolutePosition4).owner !== this._owner && possibleMoves.add(absolutePosition4)
     
      
      }
    return possibleMoves;
  }
  
}

class Knight extends Piece{
  constructor(owner, position){
    super(owner, position, 'Knight')
  }
  get type(){
    return this._type;
  }
  get owner(){
    return this._owner;
  }
  set position(pos){
    this._updatePosition(pos);
    
  }
  get position(){
    return this._position;
  }
  _checkValidPostion(set, position){
    (!piecesInBoard.get(position) || piecesInBoard.get(position).owner != this.owner) && set.add(position)
    
  }
  calcPossibleMoves(){
    const possibleMoves = new Set();
    const curRow = Number(this._position.charAt(1));
    const curCol = alphabets.indexOf(this._position.charAt(0))
    let candidatePosition = alphabets[curCol + 1] + (curRow - 2)
    this._checkValidPostion(possibleMoves, candidatePosition);
    
    candidatePosition =  alphabets[curCol + 1] + (curRow + 2)
    this._checkValidPostion(possibleMoves, candidatePosition);
    
    candidatePosition = alphabets[curCol - 1] + (curRow - 2)
    this._checkValidPostion(possibleMoves ,candidatePosition);
    
    candidatePosition = alphabets[curCol - 1] + (curRow + 2)
    this._checkValidPostion(possibleMoves ,candidatePosition);

    candidatePosition = alphabets[curCol - 2] + (curRow + 1)
    this._checkValidPostion(possibleMoves ,candidatePosition);

    candidatePosition = alphabets[curCol + 2] + (curRow - 1)
    this._checkValidPostion(possibleMoves ,candidatePosition);

    candidatePosition = alphabets[curCol - 2] + (curRow - 1)
    this._checkValidPostion(possibleMoves ,candidatePosition);

    candidatePosition = alphabets[curCol + 2] + (curRow + 1)
    this._checkValidPostion(possibleMoves ,candidatePosition);
    
    return possibleMoves;
  }
}

class Dummy extends Piece{
  constructor(owner, position, type){
    super(owner, position, type)
  }
  _checkValidPosition(position){
    if(position.length > 2) return false;
    return true;
  }
  _checkValidCell(set ,position)
  {
    set.add(position);  
    if(piecesInBoard.get(position)) return false
    return true;
  }
 
  _getPossibleDiagonalMoves(){
    const possibleMoves = new Set();
    const curRow = Number(this._position.charAt(1))
    const curCol = alphabets.indexOf(this._position.charAt(0))
    let curRowIter = curRow;
    let curColIter = curCol;

    let candidatePosition;    

    curRowIter++;
    curColIter++;
    candidatePosition = alphabets[curColIter] + curRowIter;    

    while(alphabets[curColIter] &&this._checkValidPosition(candidatePosition)&& 
    this._checkValidCell(possibleMoves, candidatePosition)){

      curRowIter++;
      curColIter++;
      candidatePosition = alphabets[curColIter] + curRowIter;    

    }
    
    curRowIter = curRow;
    curColIter = curCol;

    curRowIter--;
    curColIter--;
    candidatePosition = alphabets[curColIter] + curRowIter;  
    //log(this._checkValidPosition(candidatePosition))
      
    while(alphabets[curColIter] && this._checkValidPosition(candidatePosition)&& 
    this._checkValidCell(possibleMoves, candidatePosition)){

      curRowIter--;
      curColIter--;
      candidatePosition = alphabets[curColIter] + curRowIter;
      //console.log(candidatePosition)

    }

    curRowIter = curRow;
    curColIter = curCol;
    
    curRowIter--;
    curColIter++;
    candidatePosition = alphabets[curColIter] + curRowIter;    
  
    while(alphabets[curColIter] &&this._checkValidPosition(candidatePosition)&& 
    this._checkValidCell(possibleMoves, candidatePosition)){

      curRowIter--;
      curColIter++;
      candidatePosition = alphabets[curColIter] + curRowIter;    
    }

    
    curRowIter = curRow;
    curColIter = curCol;
    curRowIter++;
    curColIter--;
    candidatePosition = alphabets[curColIter] + curRowIter;    

    while(alphabets[curColIter] &&this._checkValidPosition(candidatePosition)&& 
    this._checkValidCell(possibleMoves, candidatePosition)){

      curRowIter++;
      curColIter--;
      candidatePosition = alphabets[curColIter] + curRowIter;    
    }
    return possibleMoves;
  }
  _getPossibleStraightMoves(){
    const possibleMoves = new Set();
    const curRow = Number(this._position.charAt(1))
    const curCol = alphabets.indexOf(this._position.charAt(0))
    
    let curRowIter = curRow;
    let curColIter = curCol;

    let candidatePosition;
    
    curColIter++;
    candidatePosition = alphabets[curColIter] + curRowIter;
    //console.log(candidatePosition);
    while(alphabets[curColIter] && 
    this._checkValidCell(possibleMoves, candidatePosition)){

      curColIter++;
      candidatePosition = alphabets[curColIter] + curRow;
    }

    curColIter = curCol;
    curColIter--;
    candidatePosition = alphabets[curColIter] + curRow;
    while(alphabets[curColIter] && 
      this._checkValidCell(possibleMoves, candidatePosition)){
  
        curColIter--;
        candidatePosition = alphabets[curColIter] + curRow;
      }

    curRowIter = curRow;
    curRowIter++;
    candidatePosition = alphabets[curCol] + curRowIter;
    while(this._checkValidPosition(candidatePosition) && 
        this._checkValidCell(possibleMoves, candidatePosition)){
          curRowIter++;
          candidatePosition = alphabets[curCol] + curRowIter;
      }

      curRowIter = curRow
      curRowIter--;
      candidatePosition = alphabets[curCol] + curRowIter;
    while(this._checkValidPosition(candidatePosition) && 
        this._checkValidCell(possibleMoves, candidatePosition)){
          curRowIter--;
          candidatePosition = alphabets[curCol] + curRowIter;
        }
      return possibleMoves;
  }  
}

class Bishop extends Dummy{

  constructor(owner, position){
    super(owner, position, 'Bishop')
  }
  get type(){
    return this._type;
  }
  get owner(){
    return this._owner;
  }
  set position(pos){
    this._updatePosition(pos)
  }
  get position(){
    return this._position;
  }
  calcPossibleMoves(){
    return this._getPossibleDiagonalMoves()

  }

}

class Rook extends Dummy {

  constructor(owner, position){
    super(owner, position, 'Rook')
  }
  get type(){
    return this._type;
  }
  get owner(){
    return this._owner;
  }
  set position(pos){
    this._updatePosition(pos)
  }
  get position(){
    return this._position;
  }

  calcPossibleMoves(){
    return this._getPossibleStraightMoves()
  }
}

class Queen extends Dummy {

  constructor(owner, position){
    super(owner, position, 'Queen')
  }
  get type(){
    return this._type;
  }
  get owner(){
    return this._owner;
  }
  set position(pos){
    this._updatePosition(pos);
  }
  get position(){
    return this._position;
  }

  calcPossibleMoves(){
    return new Set([...this._getPossibleDiagonalMoves(), ...this._getPossibleStraightMoves()])
  }
}

class King extends Piece {

  constructor(owner, position){
    super(owner, position, 'King')
    this._isCapture = false;
    this._isCheckMate = false;

  }
  
  get type(){
    return this._type;
  }
  get owner(){
    return this._owner;
  }
  get isCapture(){
    return this._isCapture;
  }
  set isCapture(state){
    this._isCapture = state;
  }
  get isCheckMate(){
    return this._isCheckMate;
  }
  set isCheckMate(state){
    this._isCheckMate = state;
  }
  set position(pos){
    this._updatePosition(pos);

  }
  get position(){
    return this._position;
  }
  
  _getInvalidPositions(){
    const invalidPositions = new Set();
    for(const piece of piecesInBoard.values()){
      if(piece.owner === this.owner || piece.type === 'King') continue;
      if(piece.type === 'Pawn'){
        const curRow = Number(piece._position.charAt(1))
        const curCol = alphabets.indexOf(piece.position.charAt(0));
    
        if(piece.owner === 'b'){
          invalidPositions.add(alphabets[curCol - 1] + (curRow + 1))
          invalidPositions.add(alphabets[curCol + 1] + (curRow + 1))
        }else{
          invalidPositions.add(alphabets[curCol - 1] + (curRow - 1))
          invalidPositions.add(alphabets[curCol + 1] + (curRow - 1))
        }

      }else{
      
        const positions = piece.calcPossibleMoves()
        positions.forEach((value) => invalidPositions.add(value))
      }
    }

    return invalidPositions;
  }
  
  checkCapture(){
    const invalidPositions = this._getInvalidPositions();
    this.isCapture = invalidPositions.has(this.position)
    console.log(this.position, this)
    return this.isCapture;
  }
  calcPossibleMoves(){
    const possibleMoves = new Set();
    const curRow = Number(this._position.charAt(1))
    const curCol = alphabets.indexOf(this.position.charAt(0));
    const invalidPositions = this._getInvalidPositions();
    Piece.removeInvalidPositions(invalidPositions)
    let candidatePosition;
  
    candidatePosition = alphabets[curCol + 1] + curRow;
    !invalidPositions.has(candidatePosition) && piecesInBoard.get(candidatePosition)?.owner !== this._owner &&  possibleMoves.add(candidatePosition);

    candidatePosition = alphabets[curCol - 1] + curRow;
    !invalidPositions.has(candidatePosition) && piecesInBoard.get(candidatePosition)?.owner !== this._owner &&  possibleMoves.add(candidatePosition);

    candidatePosition = alphabets[curCol] + (curRow + 1);
    !invalidPositions.has(candidatePosition) && piecesInBoard.get(candidatePosition)?.owner !== this._owner &&  possibleMoves.add(candidatePosition);

    candidatePosition = alphabets[curCol] + (curRow - 1);
    !invalidPositions.has(candidatePosition) && piecesInBoard.get(candidatePosition)?.owner !== this._owner &&  possibleMoves.add(candidatePosition);

    candidatePosition = alphabets[curCol - 1] + (curRow - 1);
    !invalidPositions.has(candidatePosition) && piecesInBoard.get(candidatePosition)?.owner !== this._owner &&  possibleMoves.add(candidatePosition);

    candidatePosition = alphabets[curCol + 1] + (curRow + 1);
    !invalidPositions.has(candidatePosition) && piecesInBoard.get(candidatePosition)?.owner !== this._owner &&  possibleMoves.add(candidatePosition);

    candidatePosition = alphabets[curCol + 1] + (curRow - 1);
    !invalidPositions.has(candidatePosition) && piecesInBoard.get(candidatePosition)?.owner !== this._owner &&  possibleMoves.add(candidatePosition);

    candidatePosition = alphabets[curCol - 1] + (curRow + 1);
    !invalidPositions.has(candidatePosition) && piecesInBoard.get(candidatePosition)?.owner !== this._owner &&  possibleMoves.add(candidatePosition);

    return possibleMoves;
  }
}

const newBoard = function(){

  //place pawns for both players
  // 1) placing pawns
  alphabets.forEach((alphabet) => {
    piecesInBoard.set(alphabet + 7, new Pawn('w', alphabet + 7))
    piecesInBoard.set(alphabet + 2, new Pawn('b', alphabet + 2)) 
  })

  // 2) placing rooks
  piecesInBoard.set('a1', new Rook('b', 'a1'))
  piecesInBoard.set('h1', new Rook('b', 'h1'))
  piecesInBoard.set('a8', new Rook('w', 'a8'))
  piecesInBoard.set('h8', new Rook('w', 'h8'))
  
  
  
  // 3) placing knights
  piecesInBoard.set('b1', new Knight('b', 'b1'))
  piecesInBoard.set('g1', new Knight('b', 'g1'))
  piecesInBoard.set('b8', new Knight('w', 'b8'))
  piecesInBoard.set('g8', new Knight('w', 'g8'))
 
  
  // 4) placing bishops
  piecesInBoard.set('c1', new Bishop('b', 'c1'))
  piecesInBoard.set('f1', new Bishop('b', 'f1'))
  piecesInBoard.set('c8', new Bishop('w', 'c8'))
  piecesInBoard.set('f8', new Bishop('w', 'f8'))
  
  // 5) placing queens
  piecesInBoard.set('d1', new Queen('b', 'd1'))
  piecesInBoard.set('d8', new Queen('w', 'd8'))
  
  // 5) placing kings
  piecesInBoard.set('e1', new King('b', 'e1'))
  piecesInBoard.set('e8', new King('w', 'e8'))
}

newBoard()


const highlightCells = function(positions){
  
  Array.from(positions).forEach((position) => {
    document.getElementById(position)?.classList.add('highlight')})
}
const removeHighlightCells = function(positions){
  
    Array.from(positions).forEach((position) => {
      document.getElementById(position)?.classList.remove('highlight')})
}

let time = 0;
// Timer
setInterval(function(){
  time++;
  const min = String(Number.parseInt(time / 60)).padStart(2, '0');
  const sec = String(time % 60).padStart(2, '0');
  timer.textContent = min + ":" + sec;
}, 1000)

let click = 0;
let playerRole = 'w';
let curPositions = null;
let selectedPiece = null;
let prevPos = null;
let highlightedMovement = false;
const kingW = piecesInBoard.get('e8')
const kingB = piecesInBoard.get('e1')



// handling click event on each cell
board.addEventListener('click', function(e){
  
  const cell = e.target.closest('.cell');

  cell.classList.add('animated-btn')
  
  setTimeout(function(element){
    element.classList.remove('animated-btn')
  },200, cell)
  
  const piece = piecesInBoard.get(cell.id);
  
  if(piece && piece.owner === playerRole){
    selectedPiece = piece;
    curPositions && removeHighlightCells(curPositions);
    curPositions = piece.calcPossibleMoves();
    Piece.removeInvalidPositions(curPositions)
    curPositions = [...curPositions].filter((pos) => {
      return piecesInBoard.get(pos)?.owner !== playerRole
    })
    curPositions = new Set(curPositions);
    highlightCells(curPositions);

  }else{
    if(selectedPiece){
      if(curPositions.has(cell.id))
      {
        prevPos = selectedPiece.position
        
        if(kingW.isCapture){

          const temp = piecesInBoard.get(cell.id);
          piecesInBoard.delete(cell.id);
          piecesInBoard.delete(selectedPiece.position);
          piecesInBoard.set(cell.id, selectedPiece);
          const savePos = selectedPiece.position
          selectedPiece.setPosition(cell.id)
          console.log(selectedPiece)
          
          if(kingW._getInvalidPositions().has(kingW.position)){
            piecesInBoard.delete(cell.id)&& temp && piecesInBoard.set(cell.id, temp)
            selectedPiece.setPosition(savePos);  
            piecesInBoard.set(selectedPiece.position, selectedPiece)
            return; 
          }
          
          piecesInBoard.delete(cell.id) && temp && piecesInBoard.set(cell.id, temp);
          selectedPiece.setPosition(savePos);  
          piecesInBoard.set(selectedPiece.position, selectedPiece)
          document.getElementById(kingW.position).classList.remove('capture')
          kingW.isCapture = false;
        }
        else if (kingB.isCapture){
          
          const temp = piecesInBoard.get(cell.id);
          piecesInBoard.delete(cell.id);
          piecesInBoard.delete(selectedPiece.position);
          piecesInBoard.set(cell.id, selectedPiece);
          const savePos = selectedPiece.position
          selectedPiece.setPosition(cell.id)
          

          if(kingB._getInvalidPositions().has(kingB.position)){
            piecesInBoard.delete(cell.id)&& temp && piecesInBoard.set(cell.id, temp)
            selectedPiece.setPosition(savePos);  
            piecesInBoard.set(selectedPiece.position, selectedPiece)
            return; 
          }
          
          piecesInBoard.delete(cell.id) && temp && piecesInBoard.set(cell.id, temp);
          selectedPiece.setPosition(savePos);  
          piecesInBoard.set(selectedPiece.position, selectedPiece)
          document.getElementById(kingB.position).classList.remove('capture')
          kingB.isCapture = false;
        }



        if(piecesInBoard.get(cell.id)){
          piecesInBoard.get(cell.id).remove();
          highlightedMovement = true;
        }
        selectedPiece.position = cell.id

        let invalidPositions = kingW._getInvalidPositions();
        if(invalidPositions.has(kingW.position)){
            kingW.isCapture = true;
            document.getElementById(kingW.position).classList.add('capture')  
        }

        invalidPositions = kingB._getInvalidPositions();
        if(invalidPositions.has(kingB.position)){
          document.getElementById(kingB.position).classList.add('capture')
          kingB.isCapture = true;
        }

        const player = playerRole == 'w' ? 'one' : 'two';
        
        const trackerList = document.querySelector(`.player-${player}-tracker .movements`)

        trackerList.insertAdjacentHTML('beforeend', 
        `<li class = "movement ${highlightedMovement ? 'highlight' : ' '}" > Player ${player} moves ${selectedPiece.type}  from ${prevPos} to ${cell.id}</li>`)
        
        highlightedMovement = false;
        playerRole = playerRole == 'w' ? 'b' : 'w'
        time = 0;
        
    }
    if(curPositions) removeHighlightCells(curPositions)
    selectedPiece = null;
    curPositions = null;
  }

}

})


