import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/UndoButton.css';

@pureRender
export default class UndoButton extends Component {

	constructor(props) {

		super(props);

		this.undo = this.undo.bind(this);

	}

	undo() {
		!this.props.disabled && this.props.undo();
	}

	render() {

		const {disabled} = this.props;
		const {undo} = this;

		return (
			<button title="undo"
			        className="UndoButton"
			        onClick={undo}
			        disabled={disabled}>
				<i className="fa fa-reply"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

UndoButton.propTypes = {

	// redux undo
	undo: PropTypes.func,

	// Action
	disabled: PropTypes.bool

};