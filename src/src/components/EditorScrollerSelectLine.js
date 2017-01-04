import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class EditorScrollerSelectLine extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.editorConfig.lineHeight !== this.props.editorConfig.lineHeight
			|| nextProps.top !== this.props.top
			|| nextProps.left !== this.props.left
			|| nextProps.width !== this.props.width;
	}

	render() {

		// console.log('EditorScrollerSelectLine render');

		const {editorConfig, top, left, width} = this.props;

		let style = {
			height: editorConfig.lineHeight
		};
		if (top) {
			style.top = top;
		}
		if (left) {
			style.left = left;
		}
		if (width) {
			style.width = width;
		}

		return (
			<div className="select-line"
			     style={style}></div>
		);

	}
};

EditorScrollerSelectLine.propTypes = {

	// EditorScrollerMarkerLayer
	editorConfig: PropTypes.object,
	top: PropTypes.number,
	left: PropTypes.number,
	width: PropTypes.number

};