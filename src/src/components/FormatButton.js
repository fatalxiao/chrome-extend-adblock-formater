import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/FormatButton.css';

@pureRender
export default class FormatButton extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {formatData, disabled} = this.props;

		return (
			<button title="format"
			        className="FormatButton"
			        onClick={formatData}
			        disabled={disabled}>
				<i className="fa fa-long-arrow-right"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

FormatButton.propTypes = {

	// redux action
	formatData: PropTypes.func,

	// Action
	disabled: PropTypes.bool

};