import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		const rows = [];
		let count = 0;

		for (let i = 0; i < 3; i++) {
			let squares = [];

			for (let j = 0; j < 3; j++) {
				squares.push(this.renderSquare(count));

				count++;
			}

			rows.push(<div className="board-row">{squares}</div>);
		}

		return rows;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			xIsNext: true,
			currentMoveIndex: 0,
			sortMoveHistoryByAscendingOrder: true,
		};
  	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.currentMoveIndex + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const location = ["Left, Top", "Center, Top", "Right, Top", "Left, Center", "Center, Center", "Right, Center", "Left, Bottom", "Bottom, Bottom", "Right, Bottom"];

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.state.xIsNext ? 'X' : 'O';

		this.setState({
			history: history.concat([
			{
				squares: squares,
				lastMoveLocation: location[i],
			}]),
			currentMoveIndex: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(historyIndex) {
		this.setState({
			currentMoveIndex: historyIndex,
			xIsNext: (historyIndex % 2) === 0,
		});
	}

	getMoveHistoryButtons(history) {
		let moves = this.state.history.map((it, historyIndex) => {
			const buttonText = historyIndex ? 'Go to move #' + historyIndex + " - " + it.lastMoveLocation : 'Go to start of the game';

			return (
				<li key={historyIndex}>
					<button className={(historyIndex === this.state.currentMoveIndex) ? "selected-move" : ""} onClick={() => this.jumpTo(historyIndex)}>{buttonText}</button>
				</li>
			)
		});

		if (!this.state.sortMoveHistoryByAscendingOrder) {
			moves = moves.reverse();
		}

		return moves;
	}

	changeSortDirection() {
		this.setState({
			sortMoveHistoryByAscendingOrder: !this.state.sortMoveHistoryByAscendingOrder,
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.currentMoveIndex];
		const winner = calculateWinner(current);

		let status;

		if (winner) {
			status = "Winner is: " + winner;
		}
		else {
			status = "Next player is: " + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status} <button onClick={() => this.changeSortDirection()}>Sort Ascending/Descending Order</button></div>
					<ol>{this.getMoveHistoryButtons()}</ol>
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
