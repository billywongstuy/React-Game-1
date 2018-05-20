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
		<button className="square">
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
	this.renderSquare = this.renderSquare.bind(this);
    }
    
    renderSquare(i) {
	return <Square value={i} />;
    }

    renderRow(row,rowNum) {
	return row.map((square,squareNum) => {
	    return (
		    <td key={squareNum}>
		    {this.renderSquare(square + " " + rowNum + "," + squareNum)}
		</td>
	    );
	});
    }
    
    render() {
	const squares = this.state.squares;
	console.log(squares);

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

class Game extends React.Component {
    constructor(props) {
	super(props);
    }
    
    render() {
	return (
		<Board size={this.props.size}/>
	)
    }
}

ReactDOM.render(
	<Game size={4}/>, document.getElementById('root')
);

//npm start
