import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import TextLine from './TextLine';

import '../assets/stylesheets/TextArea.css';

@pureRender
export default class TextArea extends Component {

	constructor(props) {

		super(props);

		this.nextStateAnimationFrameId = null;
		this.textLineHeight = 25;

		this.state = {
			textAreaHeight: 0,
			scrollTop: 0
		};

		this.scrollHandle = this.scrollHandle.bind(this);

	}

	setNextState(state) {
		if (this.nextStateAnimationFrameId) {
			requestAnimationFrame.cancel(this.nextStateAnimationFrameId);
		}
		this.nextStateAnimationFrameId = requestAnimationFrame(()=> {
			this.nextStateAnimationFrameId = null;
			this.setState(state);
		});
	}

	scrollHandle(e) {
		this.setNextState({
			scrollTop: e.target.scrollTop
		});
	}

	filterArray(arrayData, filterText) {
		let array = [];
		if (arrayData && arrayData.length > 0) {
			array = arrayData;
			if (filterText !== '') {
				array = array.filter((value)=> value.indexOf(filterText) >= 0);
			}
		}
		return array;
	}

	getIndex(array, textAreaHeight) {

		let startIndex, endIndex = array.length - 1;

		startIndex = Math.floor(this.state.scrollTop / this.textLineHeight);

		const listLength = Math.ceil(textAreaHeight / this.textLineHeight);
		if (array.length > listLength) {
			endIndex = startIndex + listLength;
		}
		return {
			startIndex,
			endIndex
		};
	}

	render() {

		const {arrayData, filterText, windowHeight, modifyLine, deleteLine} = this.props;
		const {textLineHeight, scrollHandle} = this;

		const array = this.filterArray(arrayData, filterText);

		const textAreaHeight = windowHeight - 80;
		const contentStyle = {
			height: textLineHeight * array.length
		};

		const {startIndex, endIndex} = this.getIndex(array, textAreaHeight);

		return (
			<div ref="TextArea"
			     className="TextArea">

				<div className="lineNumberBackground"></div>

				<div className="textListWrap"
				     onScroll={scrollHandle}>
					<div className="textList"
					     style={contentStyle}>
						{
							array.map((value, index)=> {
								if (index >= startIndex && index <= endIndex) {
									return (
										<TextLine style={{top: textLineHeight * index}}
										          key={index}
										          textData={value}
										          lineIndex={index}
										          modifyLine={modifyLine}
										          deleteLine={deleteLine}/>
									);
								}
							})
						}
					</div>
				</div>

			</div>
		);

	}
};

TextArea.propTypes = {

	// Frame
	arrayData: PropTypes.array,
	filterText: PropTypes.string,
	modifyLine: PropTypes.func,
	deleteLine: PropTypes.func,
	windowHeight: PropTypes.number

};