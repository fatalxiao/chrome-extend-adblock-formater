import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/CopyButton.css';

@pureRender
export default class CopyButton extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {hidden, copy_result} = this.props;

		return (
			<button title="copy result"
			        className={'CopyButton' + (hidden ? ' hidden' : '')}
			        onClick={copy_result}>
				<i className="fa fa-files-o"
				   aria-hidden="true"></i>
			</button>
		);

	}
};

CopyButton.propTypes = {

	// Action
	hidden: PropTypes.bool,

	// redux action
	copy_result: PropTypes.func

};