import React from 'react'; 
import ReactDOM from 'react-dom'; 
import './index.css'; 

function Square(props) { //This is now a function component
  return ( 
    <button className="square" 
    onClick = {props.onClick}>
      {props.value}
    </button>
  ); 
}

//Rewrite somehow to use two for-loops, not this.renderSquare(0), this.renderSquare(1), etc...
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
   createSquares() {
	   let rows = []; 
	   for(var i = 0; i < 3; i++){
		   let squares = [];
			for(var j = 0; j<3; j++) {
				squares.push(this.renderSquare(3*i+j)); 
			}
			rows.push(<div className="board-row">{squares}</div>); 
	   }
	   return rows; 
   }

  render() {
    return (
      <div>
	      {this.createSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super(); 
    this.state = {
      history: [{squares: Array(9).fill(null),}],
      xIsNext: true,
      stepNumber: 0,
      historyMoves: [-1],  //-1 indicates the last move was no move (start of the game)
      order: true, 
    };
  }

  render() {
    const history = this.state.history; 
    const current = history[this.state.stepNumber]; 
    const winner = calculateWinner(current.squares);
    const historyMoves = this.state.historyMoves;  
    
    const moves = history.map((step,move) => {
      const rowN = Math.floor(historyMoves[move]/3) + 1; 
      const colN = historyMoves[move] % 3 + 1; 
      const desc = move ? 
      'Go to move #' + move + ' (' + rowN + ',' + colN + ')': 
      'Go to game start'; 
      
      return ( 
        <li key={move}>
          <button className={move===this.state.stepNumber ? 'button1' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      ); 
    }); 
    
    let status; 
    if(winner) {
      status = 'Winner: ' + winner; 
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); 
    }
    //if necessary, flip order of moves
    let dispMoves; 
    dispMoves = this.state.order ? moves : moves.reverse(); 
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares = {current.squares}
          onClick = {(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{dispMoves}</ol>
          <button onClick={() => this.toggleOrder()}>Change order</button> 
        </div>
      </div>
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); 
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const historyMoves = this.state.historyMoves.slice(0, this.state.stepNumber + 1); 
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      historyMoves: historyMoves.concat([i]),  
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step, 
      xIsNext: (step%2) === 0, 
    }); 
  }

  toggleOrder() {
    this.setState({
      order: !this.state.order, 
    })
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
