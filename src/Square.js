import React, { Component } from "react";
import "./tictactoe.css";

class Square extends Component {
  render() {
    return (
      <button
        className="square"
        onClick={this.props.onItemClick}
        style={{ background: this.props.color }}
      >
        {/* TODO */}
      </button>
    );
  }
}

export default Square;
