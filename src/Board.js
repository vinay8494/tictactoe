import React, { Component } from "react";
import Square from "./Square";
import "./tictactoe.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

var tileTypes = {
  0: { name: "None", color: "#fff" },
  1: { name: "Player1", color: "#374991" },
  2: { name: "Player2", color: "#74ea07" },
  3: { name: "None", color: "black" }
};

const style = {
  padding: 10,
  textAlign: "center",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "300px"
};

const initialState = {
  turn: 1,
  status: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  count: [0, 0],
  winner: 0,
  open: false
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  checkLineHelper(player, diff, coeff, lineIndex) {
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
          let win = 0;
          let candidateToWin = 3 - this.state.turn;
          if (
            arrayCount[candidateToWin - 1] > 2 &&
            this.checkPlayerWin(candidateToWin, item)
          ) {
            win = candidateToWin;
          }
          if (
            arrayCount[candidateToWin - 1] + arrayCount[this.state.turn - 1] ===
              9 &&
            win === 0
          ) {
            win = 3;
          }
          let turn = this.state.turn;
          this.setState({
            winner: win,
            turn: turn,
            open: win !== 0
          });
        }
      );
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  renderSquare(i) {
    let boundItemClick = this.onItemClick.bind(this, i);
    const bg = tileTypes[this.state.status[i]].color;
    return <Square onItemClick={boundItemClick} color={bg} />;
  }

  resetState() {
    this.setState(initialState);
  }

  render() {
    let partial = null;
    let message = null;
    if (this.state.winner === 0) {
      partial = (
        <div
          className="gap"
          style={{
            color: tileTypes[this.state.turn].color
          }}
        >
          Next Player's Turn : {tileTypes[this.state.turn].name}
        </div>
      );
    }
    if (this.state.winner === 3) {
      message = "Match drawn";
    } else {
      message = "Winner is " + tileTypes[this.state.winner].name;
    }
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />
    ];

    return (
      <MuiThemeProvider>
        <div className="board">
          <Paper style={style} zdepth={10}>
            <div className="gap" style={{ fontWeight: "bold" }}>
              Tic Tac Toe
            </div>
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
            <RaisedButton
              backgroundColor="#a81572"
              label="Reset"
              labelColor="#fff"
              disabledBackgroundColor="#a4a4a4"
              style={{
                margin: 10
              }}
              onClick={this.resetState.bind(this)}
            />
            <Dialog
              actions={actions}
              modal={false}
              bodyStyle={{
                color: tileTypes[this.state.winner].color
              }}
              contentStyle={{
                maxWidth: "300px",
                textColor: tileTypes[this.state.winner].color
              }}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              {message}
            </Dialog>
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Board;
