import React, { useState } from "react";
import ReactDOM from "react-dom";
import './index.css';

type SquareState = 'O' | 'X' | null
type SquareProps = {
  value: SquareState
  onClick: () => void
}

const Square = (props: SquareProps) => (
  <button className="square" onClick={props.onClick}>
    {props.value}
  </button>
)

type BoardState = Array<SquareState>
type BoardProps = {
  squares: BoardState
  onClick: (i: number) => void
}

const Board = (props: BoardProps) => {
  const renderSquare = (i: number) => (
    <Square
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />
  )

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

type Step = {
  readonly squares: BoardState
  readonly xIsNext: boolean
}

type GameState = {
  readonly history: Array<Step>
  readonly stepNumber: number
}

const Game = () => {
  const [state, setState] = useState<GameState>({
    history: [{
      squares: Array(9).fill(null),
      xIsNext: true,
    }],
    stepNumber: 0,
  })

  const current = state.history[state.stepNumber];
  const winner = calculateWinner(current.squares);
  let status: string;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
  }

  const handleClick = (i: number) => {
    if (winner || current.squares[i]) {
      return;
    }

    const history = state.history.slice(0, state.stepNumber + 1);
    const squares = current.squares.slice();
    squares[i] = current.xIsNext ? 'X' : 'O';

    setState({
      history: history.concat([{
        squares: squares,
        xIsNext: !current.xIsNext,
      }]),
      stepNumber: history.length,
    });
  }

  const jumpTo = (step: number) => {
    setState(prev => ({
      ...prev,
      stepNumber: step,
    }))
  }

  const moves = state.history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    )
  })

  return (
    <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
    </div>
  );
}

function calculateWinner(squares: Array<string>) {
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
