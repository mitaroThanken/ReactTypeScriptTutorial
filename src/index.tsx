import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface SquarePropsInterface {
  value: string;
  onClick: () => void;
}

function Square(props: SquarePropsInterface) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

interface BoardPropsInterface {
  squares: string[];
  xIsNext: boolean;
  winner: string;
  onClick: (i: number) => void;
}

class Board extends React.Component<BoardPropsInterface> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

interface GamePropsInterface {}

interface GameStateInterface {
  history: string[][];
  xIsNext: boolean;
  winner: string;
}

class Game extends React.Component<GamePropsInterface, GameStateInterface> {
  constructor(props: GamePropsInterface) {
    super(props);
    this.state = {
      history: [Array<string>(9).fill("")],
      xIsNext: true,
      winner: "",
    };
  }

  calculateWinner(squares: string[]): string {
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
      if (
        squares[a] !== "" &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return "";
  }

  currentStatus(xIsNext: boolean, winner: string): string {
    let status: string;
    if (winner !== "") {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
    return status;
  }

  handleClick(i: number) {
    const history = this.state.history.slice();
    const squares = this.state.history[this.state.history.length - 1].slice();
    if (squares[i] !== "" || this.state.winner !== "") return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    const winner = this.calculateWinner(squares);
    history.push(squares);
    this.setState({
      history: history,
      xIsNext: !this.state.xIsNext,
      winner: winner,
    });
  }

  junpTo(index: number) {
    const newHistory = this.state.history.slice(0, index + 1);
    const xIsNext = index % 2 == 0 ? true : false;
    this.setState({
      history: newHistory,
      xIsNext: xIsNext,
      winner: this.calculateWinner(newHistory[index]),
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[history.length - 1];
    const status = this.currentStatus(this.state.xIsNext, this.state.winner);
    const moves = history.map((sqares, index) => {
      const desc = index !== 0 ? "Go to #" + (index + 1) : "Go to game start";
      return (
        <li key={index}>
          <button
            onClick={() => {
              this.junpTo(index);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current}
            xIsNext={this.state.xIsNext}
            winner={this.state.winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
