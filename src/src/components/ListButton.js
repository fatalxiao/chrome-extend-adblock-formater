import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class ListButton extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {active, onClick} = this.props;

		return (
			<button className={'ListButton' + (active ? ' active' : '')}
			        title="list"
			        onClick={onClick}>
				<i className="fa fa-align-left"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

ListButton.propTypes = {

	// Toolbar
	active: PropTypes.bool,
	onClick: PropTypes.func

};