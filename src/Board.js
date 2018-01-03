import React, { Component } from "react";
import Square from "./Square";
import "./tictactoe.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import IconButton from "material-ui/IconButton";
import AppBar from "material-ui/AppBar";

var tileTypes = {
  0: { name: "None", color: "#fff" },
  1: { name: "Blue", color: "#2b47b2" },
  2: { name: "Green", color: "#3bd1a6" },
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
  open: false,
  opponent: "0", //0 -> against computer, 1 -> against friend
  updateNextMove: false
};

const opponentMessage = ["Playing against Computer", "Playing against Friend"];

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  checkLineHelper(player, diff, coeff, lineIndex, positions) {
    console.log("positions " + positions);
    return (
      positions[coeff * lineIndex] === player &&
      positions[coeff * lineIndex + diff] === player &&
      positions[coeff * lineIndex + 2 * diff] === player
    );
  }

  checkHorizontalLines(player, position, positions) {
    return this.checkLineHelper(
      player,
      1,
      3,
      Math.floor(position / 3),
      positions
    );
  }

  checkVerticalLines(player, position, positions) {
    return this.checkLineHelper(player, 3, 1, position % 3, positions);
  }

  checkDiagnols(player, positions) {
    return (
      positions[4] === player &&
      ((positions[0] === player && positions[8] === player) ||
        (positions[2] === player && positions[6] === player))
    );
  }

  checkPlayerWin(player, position, positions) {
    return (
      this.checkHorizontalLines(player, position, positions) ||
      this.checkVerticalLines(player, position, positions) ||
      this.checkDiagnols(player, positions)
    );
  }

  setOpponent = (event, value) => {
    this.setState({
      opponent: value
    });
  };

  findBestWinningMove(player, unfilledBox) {
    var bestMove = null;
    var arrayStatus = this.state.status.slice();
    for (var i = 0; i < unfilledBox.length; i++) {
      arrayStatus[unfilledBox[i]] = player;
      if (this.checkPlayerWin(player, unfilledBox[i], arrayStatus)) {
        bestMove = unfilledBox[i];
        break;
      }
      arrayStatus[unfilledBox[i]] = 0;
    }
    console.log("bestmove: " + bestMove);
    console.log("status: " + this.state.status);
    return bestMove;
  }

  findBestMove(player) {
    var unfilledBox = this.state.status.reduce((a, e, i) => {
      if (e === 0) a.push(i);
      return a;
    }, []);

    //play winning move of computer
    var optimalMove = this.findBestWinningMove(player, unfilledBox);
    if (optimalMove != null) return optimalMove;

    //prevent winning move of opponent
    optimalMove = this.findBestWinningMove(3 - player, unfilledBox);
    if (optimalMove != null) return optimalMove;

    //pick center element
    if (unfilledBox.includes(4)) return 4;

    //pick corner elements
    optimalMove = unfilledBox.find(element => !(element & 1));
    if (optimalMove != null) return optimalMove;

    return unfilledBox[0];
  }

  updateMove(position) {
    if (this.state.winner === 0 && this.state.status[position] === 0) {
      var arrayStatus = this.state.status.slice();
      arrayStatus[position] = this.state.turn;
      var arrayCount = this.state.count.slice();
      arrayCount[this.state.turn - 1] = arrayCount[this.state.turn - 1] + 1;
      var updateNextMove = this.state.updateNextMove;
      if (this.state.opponent === "0") {
        updateNextMove = !updateNextMove;
      }
      this.setState(
        {
          status: arrayStatus,
          count: arrayCount,
          turn: 3 - this.state.turn,
          updateNextMove: updateNextMove
        },
        () => {
          let candidateToWin = 3 - this.state.turn;
          if (
            arrayCount[candidateToWin - 1] > 2 &&
            this.checkPlayerWin(candidateToWin, position, this.state.status)
          ) {
            this.setState({
              winner: candidateToWin,
              open: true
            });
            return;
          }
          if (
            arrayCount[candidateToWin - 1] + arrayCount[this.state.turn - 1] ===
            9
          ) {
            this.setState({
              winner: 3,
              open: true
            });
            return;
          }
          console.log("updateNextMove " + this.state.updateNextMove);
          if (this.state.updateNextMove && this.state.opponent === "0") {
            var optimumMove = this.findBestMove(this.state.turn);
            this.updateMove(optimumMove);
          }
        }
      );
    }
  }

  onItemClick(position, e) {
    this.updateMove(position);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  resetGame = () => {
    this.resetState();
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
    console.log(this.state);
    let partial = null;
    let message = null;

    if (this.state.winner === 0 && this.state.opponent === "1") {
      partial = (
        <div
          className="gap"
          style={{
            color: tileTypes[this.state.turn].color
          }}
        >
          <div>Next Player's Turn : {tileTypes[this.state.turn].name}</div>
        </div>
      );
    }
    if (this.state.winner === 3) {
      message = "Match drawn";
    } else {
      message = "Winner is " + tileTypes[this.state.winner].name;
    }
    const actions = [
      <FlatButton
        label="Play Again"
        className="info"
        onClick={this.resetGame}
      />,
      <FlatButton label="Dismiss" onClick={this.handleClose} />
    ];

    return (
      <MuiThemeProvider>
        <div>
          <div>
            <a href="https://github.com/vinay8494/tictactoe">
              <img
                style={{ position: "absolute", top: 0, right: 0, border: 0 }}
                src="https://camo.githubusercontent.com/365986a132ccd6a44c23a9169022c0b5c890c387/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67"
                alt="Fork me on GitHub"
                data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"
              />
            </a>
          </div>
          <div className="board">
            <Paper style={style} zdepth={10}>
              <AppBar
                showMenuIconButton={false}
                iconElementRight={
                  <IconMenu
                    iconButtonElement={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    onChange={this.setOpponent}
                    value={this.state.opponent}
                    anchorOrigin={{
                      horizontal: "left",
                      vertical: "top"
                    }}
                    targetOrigin={{
                      horizontal: "left",
                      vertical: "top"
                    }}
                  >
                    <MenuItem value="0" primaryText="Play against Computer" />
                    <MenuItem value="1" primaryText="Play against Friend" />
                  </IconMenu>
                }
                className="board-title"
                title="Tic Tac Toe"
              />
              <div className="info">{opponentMessage[this.state.opponent]}</div>
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
                onRequestClose={this.resetGame}
              >
                {message}
              </Dialog>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Board;
