import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class LineNumber extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {data} = this.props;

		return (
			<div className="LineNumber">
				{
					data && data.length > 0 && data.map((item, index)=> {
						return (
							<div key={index}
							     className="number">
								{index + 1}
							</div>
						);
					})
				}
			</div>
		);
		
	}
};

LineNumber.propTypes = {

	// Frame
	data: PropTypes.array

};