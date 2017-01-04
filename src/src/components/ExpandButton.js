import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class ExpandButton extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {onClick} = this.props;

		return (
			<button className="ExpandButton"
			        title="expand all"
			        onClick={onClick}>
				<i className="fa fa-expand"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

ExpandButton.propTypes = {

	// Toolbar
	onClick: PropTypes.func

};