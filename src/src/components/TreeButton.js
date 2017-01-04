import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class TreeButton extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {active, onClick} = this.props;

		return (
			<button className={'TreeButton' + (active ? ' active' : '')}
			        title="tree"
			        onClick={onClick}>
				<i className="fa fa-list"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

TreeButton.propTypes = {

	// Toolbar
	active: PropTypes.bool,
	onClick: PropTypes.func

};