import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class CollapseButton extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {onClick} = this.props;

		return (
			<button className="CollapseButton"
			        title="collapse all"
			        onClick={onClick}>
				<i className="fa fa-compress"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

CollapseButton.propTypes = {

	// Toolbar
	onClick: PropTypes.func

};