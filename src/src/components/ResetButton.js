import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/ResetButton.css';

@pureRender
export default class ResetButton extends Component {

	constructor(props) {

		super(props);

		this.reset = this.reset.bind(this)

	}

	reset() {
		!this.props.disabled && this.props.reset();
	}

	render() {

		const {disabled} = this.props;
		const {reset} = this;

		return (
			<button title="reset"
			        className="ResetButton"
			        onClick={reset}
			        disabled={disabled}>
				<i className="fa fa-undo"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

ResetButton.propTypes = {

	// Action
	disabled: PropTypes.bool,
	reset: PropTypes.func

};