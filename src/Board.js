import React, { Component } from "react";
import Square from "./Square";
import "./tictactoe.css";

var tileTypes = {
  0: { name: "None", color: "#fff" },
  1: { name: "Player1", color: "#374991" },
  2: { name: "Player2", color: "black" }
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: 1,
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      count: [0, 0],
      winner: 0,
      boardFull: false
    };
    this.onItemClick = this.onItemClick.bind(this);
  }

  checkLineHelper(player, diff, coeff, lineIndex) {
    console.log(lineIndex, lineIndex + diff, lineIndex + 2 * diff);
    return (
      this.state.status[coeff * lineIndex] === player &&
      this.state.status[coeff * lineIndex + diff] === player &&
      this.state.status[coeff * lineIndex + 2 * diff] === player
    );
  }

  checkHorizontalLines(player, position) {
    return this.checkLineHelper(player, 1, 3, Math.floor(position / 3));
  }

  checkVerticalLines(player, position) {
    return this.checkLineHelper(player, 3, 1, position % 3);
  }

  checkDiagnols(player) {
    return (
      this.state.status[4] === player &&
      ((this.state.status[0] === player && this.state.status[8] === player) ||
        (this.state.status[2] === player && this.state.status[6] === player))
    );
  }

  checkPlayerWin(player, position) {
    return (
      this.checkHorizontalLines(player, position) ||
      this.checkVerticalLines(player, position) ||
      this.checkDiagnols(player)
    );
  }

  onItemClick(item, e) {
    if (this.state.winner === 0 && this.state.status[item] === 0) {
      var arrayStatus = this.state.status.slice();
      arrayStatus[item] = this.state.turn;
      var arrayCount = this.state.count.slice();
      arrayCount[this.state.turn - 1] = arrayCount[this.state.turn - 1] + 1;
      this.setState(
        {
          status: arrayStatus,
          count: arrayCount,
          turn: 3 - this.state.turn
        },
        () => {
          console.log(this.state.status);
          let win = 0;
          let candidateToWin = 3 - this.state.turn;
          if (
            arrayCount[candidateToWin - 1] > 2 &&
            this.checkPlayerWin(candidateToWin, item)
          ) {
            win = candidateToWin;
          }
          let totalOccupied =
            arrayCount[candidateToWin - 1] + arrayCount[this.state.turn - 1] ===
            9;
          let turn = this.state.turn;
          if (totalOccupied === true) turn = 0;
          this.setState({
            winner: win,
            boardFull: totalOccupied,
            turn: turn
          });
        }
      );
    }
  }

  renderSquare(i) {
    let boundItemClick = this.onItemClick.bind(this, i);
    const bg = tileTypes[this.state.status[i]].color;
    return <Square onItemClick={boundItemClick} color={bg} />;
  }

  render() {
    let partial = null;
    if (this.state.winner === 0)
      partial = (
        <div className="gap">
          Next Player's Turn : {tileTypes[this.state.turn].name}
        </div>
      );
    else
      partial = (
        <div className="gap">Winner : {tileTypes[this.state.winner].name}</div>
      );
    return (
      <div>
        <div className="gap">Tic Tac Toe</div>
        {partial}
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

export default Board;
