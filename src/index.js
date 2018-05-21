import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import upArrow from './uparrow.png'
import leftArrow from './leftarrow.png'
import rightArrow from './rightarrow.png'
import downArrow from './downarrow.png'

//each square be can clicked on for more info


//generic one with no actions (used for styling?)
class Square extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	return (
		<button className={this.props.className}>
	    </button>
	)
    }
}


class PatrolSquare extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	var patrolImage;
	switch(this.props.data["direction"]) {
	case 0:
	    patrolImage = upArrow
	    break;
	case 1:
	    patrolImage = rightArrow
	    break;
	case 2:
	    patrolImage = downArrow
	    break;
	case 3:
	    patrolImage = leftArrow
	    break;
	}

	//styling needs to be done
	return (
		<button className={"square patrol"}>
		<img src={patrolImage} height="100%" width="100%" alt="P" />
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
    
    renderSquare(data) {
	if (data["type"] === "player") {
	    return <Square className={'square player'} />;
	}
	else if (data["type"] === "patrol") {
	    return <PatrolSquare data={data}/>;
	}
	else if (data["type"] === "exit") {
	    return <Square className={'square exit'} />;
	}
	return <Square className={'square'} />;
    }

    renderRow(row,rowNum) {
	return row.map((square,squareNum) => {
	    const data = square ? square : {'type': null};
	    return (
		    <td key={squareNum} className='squareCell'>
		    {this.renderSquare(data)}
		</td>
	    );
	});
    }
    
    render() {
	const squares = Array(this.props.size);
	for (var i = 0; i < this.props.size; i++) {
	    squares[i] = this.state.squares[i].slice();
	}

	squares[this.props.endPos[1]][this.props.endPos[0]] = {
	    type: "exit",
	}
	squares[this.props.currPos[1]][this.props.currPos[0]] = {
	    type: "player",
	}
	this.props.patrols.forEach(patrol => {
	    squares[patrol["pos"][1]][patrol["pos"][0]] = {
		type: "patrol",
		direction: patrol["direction"],
	    }
	});
	
	const items = squares.map((row,rowNum) => {
	    return (
		    <tr key={rowNum} className='squareRow'>
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

//prevent wasted movements?
//stop patrols from going into start and end
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
	const newPos = this.handlePlayerMovement(m);
	this.handlePatrolMovement();
	this.handleInteractions(newPos); //this is delayed and it doesn't work sometimes???
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

	return newPos;
    }


    //need to prevent from moving to exit space
    handlePatrolMovement() {
	//this is direct modification -> should avoid this
	//if no direct modification, have to pass patrols to interactions
	this.state.patrols.forEach(patrol => {
	    const rand = Math.random();
	    if (rand < patrol["leftChance"]) {
		patrol["direction"] = (patrol["direction"]+3) % 4;
	    }
	    else if (rand-patrol["leftChance"] < patrol["rightChance"]) {
		patrol["direction"] = (patrol["direction"]+1) % 4;
	    }
	    else {
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

    handleInteractions(newPos) {
	this.state.patrols.forEach(patrol => {
	    //check if in front -> send back
	    //if same space, send  back
	    var reset = true;

	    console.log(this.state.currPos);
	    reset = (patrol["pos"][0] === newPos[0] && patrol["pos"][1] === newPos[1]);
	    
	    switch(patrol['direction']) {
	    case 0:
		reset = reset || (patrol['pos'][1] > 0 && patrol['pos'][0] === newPos[0] && patrol['pos'][1]-1 === newPos[1]) ;
		break;
	    case 1:
		reset = reset || (patrol['pos'][0] < this.props.size-2 && patrol['pos'][0]+1 === newPos[0] && patrol['pos'][1] === newPos[1]);
		break;
	    case 2:
		reset = reset || (patrol['pos'][1] < this.props.size-2 && patrol['pos'][0] === newPos[0] && patrol['pos'][1]+1 === newPos[1]);
		break;
	    case 3:
		reset = reset || (patrol['pos'][0] > 0 && patrol['pos'][0]-1 === newPos[0] && patrol['pos'][1] === newPos[1]);
	    }

	    if (reset) {
		this.setState({
		    startPos: this.state.startPos,
		    endPos: this.state.endPos,
		    currPos: this.state.startPos,
		    patrols: this.state.patrols,
		});
	    }
	    
	});
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
		leftChance: 0.25, //chance to turn left -- 0 - 0.24
		rightChance: 0.25, //chance to turn right -- 0.25-0.49
		forwardChance: 0.5, //chance to move -- 0.5-1.00
	    }
	], //startpos, probabilities
    }
}

const chosenBoard = boards[chosen]

ReactDOM.render(
	<Game size={5} />, document.getElementById('root')
);

//npm start
