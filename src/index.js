import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//each square be can clicked on for more info


class Square extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	return (
		<button className={"square " + this.props.className} id={this.props.className}>
		{this.props.value}
	    </button>
	)
    }
}

class Board extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    squares: Array(this.props.size).fill(Array(this.props.size).fill(null)),
	}
    }
    
    renderSquare(text,className) {
	return <Square value={text} className={className}/>;
    }

    renderRow(row,rowNum) {
	//square + " " + rowNum + "," + squareNum
	return row.map((square,squareNum) => {
	    return (
		    <td key={squareNum} className="squareCell">
		    {this.renderSquare("aa",square)}
		</td>
	    );
	});
    }
    
    render() {
	const squares = Array(this.props.size);
	for (var i = 0; i < this.props.size; i++) {
	    squares[i] = this.state.squares[i].slice();
	}

	squares[this.props.currPos[1]][this.props.currPos[0]] = "fun";
	
	const items = squares.map((row,rowNum) => {
	    return (
		    <tr key={rowNum}>
		    {this.renderRow(row,rowNum)}
		</tr>
	    )
	});
	
	return (
		<table>
		<tbody>
		{items}
	    </tbody>
		</table>
	)
    }
}


class Controls extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	return (
	    <div>
		<button onClick={() => this.props.onClick("left")}>
		Left
	    </button>
		<button onClick={() => this.props.onClick("right")}>
		Right
	    </button>
		<button onClick={() => this.props.onClick("up")}>
		Up
	    </button>
		<button onClick={() => this.props.onClick("down")}>
		Down
	    </button>
		</div>
	)
    }
}

class Game extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    startPos: [chosenBoard["startX"],chosenBoard["startY"]],
	    endPos: [chosenBoard["endX"],chosenBoard["endY"]],
	    currPos: [chosenBoard["startX"],chosenBoard["startY"]],
	}
    }


    handleMovement(m) {
	if (m === "left") {
	    this.setState({
		startPos: this.state.startPos,
		endPos: this.state.endPos,
		currPos: [Math.max(0,this.state.currPos[0]-1),this.state.currPos[1]]
	    });
	}
	else if (m === "right") {
	    this.setState({
		startPos: this.state.startPos,
		endPos: this.state.endPos,
		currPos: [Math.min(this.state.currPos[0]+1,this.props.size-1),this.state.currPos[1]]
	    });
	}
	else if (m === "up") {
	    this.setState({
		startPos: this.state.startPos,
		endPos: this.state.endPos,
		currPos: [this.state.currPos[0],Math.max(0,this.state.currPos[1]-1)]
	    });
	}
	else if (m === "down") {
	    this.setState({
		startPos: this.state.startPos,
		endPos: this.state.endPos,
		currPos: [this.state.currPos[0],Math.min(this.state.currPos[1]+1,this.props.size-1)]
	    });
	}
    }
    
    render() {
	return (
		<div>
		{chosen}
		<Board size={this.props.size} currPos={this.state.currPos} />
		<Controls
	    onClick={(m) => this.handleMovement(m)}
		/>
		</div>
	)
    }
}

var chosen = Math.floor(Math.random()*1);

//randomization needs to come with size as well
var boards = {
    0: {
	startX: 0,
	startY: 0,
	endX: 4,
	endY: 4,
    }
}

const chosenBoard = boards[chosen]

ReactDOM.render(
	<Game size={5} />, document.getElementById('root')
);

//npm start
