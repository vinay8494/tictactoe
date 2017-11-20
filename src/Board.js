import React, { Component } from "react";
import Square from "./Square";
import "./tictactoe.css";

var tileTypes = {
  0: { name: "empty", color: "#fff" },
  1: { name: "player1", color: "#374991" },
  2: { name: "player2", color: "black" }
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: 1,
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick(item, e) {
    console.log(item);

    if (this.state.status[item] === 0) {
      var arrayStatus = this.state.status.slice();
      arrayStatus[item] = this.state.turn;
      this.setState({
        status: arrayStatus,
        turn: 3 - this.state.turn
      });
    }
    console.log(this.state);
  }

  renderSquare(i) {
    let boundItemClick = this.onItemClick.bind(this, i);
    const bg = tileTypes[this.state.status[i]].color;
    return <Square onItemClick={boundItemClick} color={bg} />;
  }

  render() {
    return (
      <div>
        <div className="title">Tic Tac Toe</div>
        <div className="title">Next Player's Turn : {this.state.turn}</div>
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
