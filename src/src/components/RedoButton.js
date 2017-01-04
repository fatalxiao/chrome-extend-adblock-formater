import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/RedoButton.css';

@pureRender
export default class RedoButton extends Component {

	constructor(props) {

		super(props);

		this.redo = this.redo.bind(this);

	}

	redo() {
		!this.props.disabled && this.props.redo();
	}

	render() {

		const {disabled} = this.props;
		const {redo} = this;

		return (
			<button title="redo"
			        className="RedoButton"
			        onClick={redo}
			        disabled={disabled}>
				<i className="fa fa-share"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

RedoButton.propTypes = {

	// redux undo
	redo: PropTypes.func,

	// Action
	disabled: PropTypes.bool

};