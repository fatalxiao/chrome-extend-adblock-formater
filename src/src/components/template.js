import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class template extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {} = this.props;

		return (
			<div className="template">
			</div>
		);

	}
};

template.propTypes = {};