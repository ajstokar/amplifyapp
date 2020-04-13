import React from 'react';

function Square(props) {
  var classNames = "square";
  if(props.isWinnerSquare) {
    classNames = classNames + " winner";
  }
  return (
    <button className={classNames} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {

    const winningSquares = this.props.winningSquares;
    
    let winningSquare = false;
    if(winningSquares) {
      for(let j=0; j<winningSquares.length; j++) {
        if(i === winningSquares[j]) {
          winningSquare = true;
          break;
        }
      }
    }

    return (
      <Square 
        isWinnerSquare={winningSquare}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}  
      />
    );
  }

  render() {
    var count = 0;
    var rows = 3;
    var cols = 3;

    var outter_divs = [];

    for (var i = rows-1; i >= 0; i--) {
      var inner_divs = [];
      for (var j = cols-1; j >= 0; j--) {
        inner_divs.push(this.renderSquare(count++));
      }     
      outter_divs.push(<div className="board-row">{inner_divs}</div>);
    }

    return (
      <div>
        {outter_divs}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveCol: null,
        moveRow: null
      }],
      stepNumber: 0,
      xIsNext: true,
      moveSortAsc: true
    }; 
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveCol: i % 3,
        moveRow: i < 3 ? 0 : (i < 6 ? 1 : 2)
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortMoves() {
    this.setState({
      moveSortAsc: !this.state.moveSortAsc
    })
  }

  renderMove(move, move_no) {
    const label = move && move_no > 0 ?
        '[c:' + move.moveCol + ', r:' + move.moveRow + '] - Move #' + move_no  :
        'Go to game start';
    const desc = (this.state.stepNumber === move_no) ? <b>{label}</b> : label;
    return (
      <li key={move_no}>
          <button onClick={() => this.jumpTo(move_no)}>{desc}</button>
        </li>
    )
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningSquares = calculateWinner(current.squares);

    var moves = [];
    if(this.state.moveSortAsc) {
      for(var i = 0; i <= history.length -1; i++) {
        moves.push(this.renderMove(history[i], i));
      }
    } else {
      for(var j = history.length -1; j >= 0; j--) {
        moves.push(this.renderMove(history[j], j));
      }
    }

    let status;
    if (winningSquares) {
      status = 'Winner: ' + current.squares[winningSquares[0]];
    } else if (this.state.stepNumber === 9) {
      status = 'No Winner: Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const toggleBtnDesc = 'Sort ' + (this.state.moveSortAsc ? 'Desc' : 'Asc');

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winningSquares={winningSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.sortMoves(this.state.moveSortAsc)}>{toggleBtnDesc}</button></div>
          <ol reversed={!this.state.moveSortAsc}>{moves}</ol>
        </div>
      </div>
    );
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
      return [a, b, c];
    }
  }
  return null;
}

// ========================================
export default Game;
