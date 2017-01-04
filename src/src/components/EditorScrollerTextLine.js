import React, {Component, PropTypes} from 'react';

import Util from '../vendor/Util';

export default class EditorScrollerTextLine extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.textData !== nextProps.textData
			|| this.props.lineIndex !== nextProps.lineIndex
			|| this.props.top !== nextProps.top
			|| this.props.editorConfig.lineHeight !== nextProps.editorConfig.lineHeight
			|| this.props.editorConfig.horizonPadding !== nextProps.editorConfig.horizonPadding;
	}

	render() {

		// console.log('EditorScrollerTextLine render');

		const {top, textData, editorConfig} = this.props;

		const lineStyle = {
			top,
			height: editorConfig.lineHeight,
			lineHeight: editorConfig.lineHeight + 'px',
			// left: editorConfig.horizonPadding
		}, itemStyle = {
			height: editorConfig.lineHeight,
			lineHeight: editorConfig.lineHeight + 'px'
		};

		const dataArray = Util.isExclude(textData) ? Util.formatExclude(textData) : Util.formatRule(textData);

		return (
			<div ref="line"
			     className="line"
			     style={lineStyle}>
				{
					dataArray.map((item, index)=> {
						return (
							<span key={index}
							      className={item.type}
							      style={itemStyle}>
								{item.value}
							</span>
						);
					})
				}
			</div>
		);

	}
};

EditorScrollerTextLine.propTypes = {

	// EditorScrollerTextLayer
	editorConfig: PropTypes.object,
	top: PropTypes.number,
	textData: PropTypes.string,
	lineIndex: PropTypes.number

};