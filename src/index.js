import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import upArrow from './uparrow.png'
import leftArrow from './leftarrow.png'
import rightArrow from './rightarrow.png'
import downArrow from './downarrow.png'

//each square be can clicked on for more info


class Square extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	return (
		<button className={"square" + this.props.className}>
		{this.props.value}
	    </button>
	)
    }
}

class PatrolSquare extends Square {
    constructor(props) {
	super(props);
    }
}

class Board extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    squares: Array(this.props.size).fill(Array(this.props.size).fill(null)),
	}
    }
    
    renderSquare(data,className) {
	return <Square value={"bb"} className={className}/>;
    }

    renderRow(row,rowNum) {
	return row.map((square,squareNum) => {
	    const className = square ? " " + square : ""
	    return (
		    <td key={squareNum} className="squareCell">
		    {this.renderSquare("aa",className)}
		</td>
	    );
	});
    }
    
    render() {
	const squares = Array(this.props.size);
	for (var i = 0; i < this.props.size; i++) {
	    squares[i] = this.state.squares[i].slice();
	}

	//maybe hold more than just a string
	squares[this.props.endPos[1]][this.props.endPos[0]] = "exit";
	squares[this.props.currPos[1]][this.props.currPos[0]] = "player";
	this.props.patrols.forEach(patrol => {
	    squares[patrol["pos"][1]][patrol["pos"][0]] = "patrol";
	});

	/*
	squares[this.props.endPos[1]][this.props.endPos[0]] = {
	    type: "exit",
	}
	squares[this.props.currPos[1]][this.props.currPos[0]] = {
	    type: "player",
	}
	this.props.patrols.forEach(patrol => {
	    squares[patrol["pos"][1]][patrol["pos"][0]] = {
		type: "patrol";
	    }
	});
	*/
	
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
		<table>
		<tbody>
		<tr>
		<td></td>
		<td>
		<button onClick={() => this.props.onClick("up")} disabled={this.props.currPos[1] <= 0}>
		<img src={upArrow} height="30px" width="30px" alt="Up"/>
	    </button>
	    </td>
		<td></td>
	    </tr>
		<tr>
		<td>
		<button onClick={() => this.props.onClick("left")} disabled={this.props.currPos[0] <= 0}>
		<img src={leftArrow} height="30px" width="30px" alt="Left"/>
	    </button>
		</td>
		<td>
		<button onClick={() => this.props.onClick("down")} disabled={this.props.currPos[1] >= this.props.size-1}>
		<img src={downArrow} height="30px" width="30px" alt="Down"/>
	    </button>
	    </td>
		<td>
		<button onClick={() => this.props.onClick("right")} disabled={this.props.currPos[0] >= this.props.size-1}>
		<img src={rightArrow} height="30px" width="30px" alt="Right"/>
	    </button>
	    </td>
	    </tr>
	    </tbody>
	    </table>
		</div>
	)
    }
}

class Game extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    startPos: chosenBoard["startPos"],
	    endPos: chosenBoard["endPos"],
	    currPos: chosenBoard["startPos"],
	    patrols: chosenBoard["patrols"],
	}
    }

    handleClick(m) {
	this.handlePlayerMovement(m);
	this.handlePatrolMovement();
	this.handleInteractions();
    }
    
    handlePlayerMovement(m) {
	var newPos = this.state.currPos.slice();
	
	if (m === 'left') {
	    newPos = [Math.max(0,this.state.currPos[0]-1),this.state.currPos[1]];
	}
	else if (m === 'right') {
	    newPos = [Math.min(this.state.currPos[0]+1,this.props.size-1),this.state.currPos[1]];
	}
	else if (m === 'up') {
	    newPos = [this.state.currPos[0],Math.max(0,this.state.currPos[1]-1)]
	}
	else if (m === 'down') {
	    newPos = [this.state.currPos[0],Math.min(this.state.currPos[1]+1,this.props.size-1)]
	}

	this.state.patrols.forEach(patrol => {
	    if (patrol['pos'][0] === newPos[0] && patrol['pos'][1] === newPos[1]) {
		newPos = this.state.currPos.slice();
	    }
	});
	

	this.setState({
	    startPos: this.state.startPos,
	    endPos: this.state.endPos,
	    currPos: newPos,
	    patrols: this.state.patrols,
	});

    }


    handlePatrolMovement() {
	this.state.patrols.forEach(patrol => {
	    //turn left
	    //
	    //turn right
	    //
	    const rand = Math.random();
	    if (rand < patrol["leftChance"]) {
		patrol["direction"] = (patrol["direction"]+3) % 4;
	    }
	    else if (rand-patrol["leftChance"] < patrol["rightChance"]) {
		patrol["direction"] = (patrol["direction"]+1)
	    }
	    else {
		console.log(patrol["direction"]);
		switch(patrol["direction"]) {
		case 0:
		    patrol["pos"][1] = Math.max(0,patrol["pos"][1]-1);
		    break;
		case 1:
		    patrol["pos"][0] = Math.min(patrol["pos"][0]+1,this.props.size-1);
		    break;
		case 2:
		    patrol["pos"][1] = Math.min(patrol["pos"][1]+1,this.props.size-1);
		    break;
		case 3:
		    patrol["pos"][0] = Math.max(0,patrol["pos"][0]-1);
		    break;
		}
	    }
	    
	});
    }

    handleInteractions() {

    }
    

    //keypressing
    
    render() {
	if (this.state.currPos[0] === this.state.endPos[0] && this.state.currPos[1] === this.state.endPos[1]) {
	    alert('You win!');
	}
	
	return (
		<div>
		{chosen}
		<Board size={this.props.size} currPos={this.state.currPos} patrols={this.state.patrols} endPos={this.state.endPos} />
		<Controls
	    onClick={(m) => this.handleClick(m)}
	    currPos={this.state.currPos}
	    size = {this.props.size}
		/>
		</div>
	)
    }
}

var chosen = Math.floor(Math.random()*1);

//randomization needs to come with size as well
var boards = {
    0: {
	startPos: [0,0],
	endPos: [4,4],
	patrols: [
	    {
		direction: 0, //0 = north, 1 = east, 2 = south, 3 = west
		pos: [2,3], //x,y
		leftChance: 0.25, //chance to turn left
		rightChance: 0.25, //chance to turn right
		forwardChance: 0.5, //chance to move
	    }
	], //startpos, probabilities
    }
}

const chosenBoard = boards[chosen]

ReactDOM.render(
	<Game size={5} />, document.getElementById('root')
);

//npm start
