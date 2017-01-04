import React, {Component, PropTypes} from 'react';

import Util from '../vendor/Util';

import EditorScrollerTextInput from './EditorScrollerTextInput';
import EditorScrollerMarkerLayer from './EditorScrollerMarkerLayer';
import EditorScrollerTextLayer from './EditorScrollerTextLayer';
import EditorScrollerCursorLayer from './EditorScrollerCursorLayer';

export default class EditorScroller extends Component {

	constructor(props) {
		super(props);

		/**
		 * 是否 mousedown 的标记
		 */
		this.mouseDown = false;

		/**
		 * 上一次 mousedown 的时间戳
		 */
		this.lastMouseDownTimestamp = null;

		/**
		 * 是否是双击的标记
		 */
		this.isDblMouseDown = false;

		/**
		 * 是否是三击的标记
		 */
		this.isTplMouseDown = false;

		/**
		 * 双击时选中文本的不连续中断字符集合
		 */
		this.discontinuousChars = [
			' ', '"', '\'', '{', '}', '[', ']', ',', '.', '|', '\\',
			'#', '!', '@', '%', '^', '&', '*', '(', ')', '+', '=',
			'/', '?', '<', '>', ';', ':', '~', '`'
		];

		this.state = {
			isFocused: false,
			// mouseStartPosition: null,
			// mouseStopPosition: null,
			selectionStartPosition: null,
			selectionStopPosition: null,
			cursorPosition: null
		};

		this.calCursorPosition = this.calCursorPosition.bind(this);
		this.calDisplayIndex = this.calDisplayIndex.bind(this);
		this.mousedownHandle = this.mousedownHandle.bind(this);
		this.mousemoveHandle = this.mousemoveHandle.bind(this);
		this.mouseupHandle = this.mouseupHandle.bind(this);
		this.replaceText = this.replaceText.bind(this);
		this.textChangedHandle = this.textChangedHandle.bind(this);
		this.keyDownHandle = this.keyDownHandle.bind(this);

	}

	/**
	 * 计算鼠标位置
	 * @returns {
	 *     position 鼠标位置
	 *     cursorPosition 光标位置
	 * }
	 */
	calMousePosition(e) {

		const offset = Util.getOffset(this.refs.scroller),
			position = {
				top: e.pageY - offset.top - 8,
				left: e.pageX - offset.left
			},
			cursorPosition = this.calCursorPosition(position);

		return {
			position,
			cursorPosition
		};
	}

	/**
	 * 计算光标位置
	 * @param position 鼠标的坐标
	 * @returns {
	 *     top 垂直偏移量
	 *     left 水平偏移量
	 *     line 行索引
	 *     col 列索引
	 * }
	 */
	calCursorPosition(position) {

		// console.log('position: ', position);

		// 默认显示在左上角第一行第一列
		const defaultResult = {
			top: 0,
			left: 0,
			line: 0,
			col: 0
		};

		if (!position) {
			return defaultResult;
		}

		const {editorData, editorConfig, getTextCursorPosition, scroll} = this.props,
			arrayData = editorData.split('\n'),
			len = arrayData.length;

		// 计算 editor 当前滚动高度时光标所在的行索引
		let line = Math.round((position.top + scroll.top) / editorConfig.lineHeight);
		line = line >= 0 ? line : 0;

		// 光标所在行的文本
		const text = arrayData[line];
		// 根据鼠标的位置计算光标的列索引
		const col = getTextCursorPosition(text, position.left);
		if (col) {
			return {
				top: line * editorConfig.lineHeight,
				left: col.len,
				line,
				col: col.index
			};
		}

		return defaultResult;

	}

	/**
	 * 根据 editor 的高度和 scrollTop 计算最终渲染的行起始索引和截止索引
	 * @param array 文本的数组
	 * @param scrollTop
	 * @returns {
	 *     start 起始索引
	 *     end 截止索引
	 * }
	 */
	calDisplayIndex(array, scrollTop) {

		let start, end = array.length - 1;

		start = Math.floor(scrollTop / this.props.editorConfig.lineHeight);

		const listLength = Math.ceil(this.props.editorSize.height / this.props.editorConfig.lineHeight);
		if (array.length > listLength) {
			end = start + listLength;
		}

		return {
			start,
			end
		};

	}

	/**
	 * mousedown 处理
	 * 设置focus，记录鼠标起始位置和光标起始位置，清除光标截止位置
	 * @param e
	 */
	mousedownHandle(e) {

		// console.log(e);

		const timestamp = new Date().getTime();

		if (e.target == this.refs.scroller || e.target == this.refs.scrollerContent) {

			this.mouseDown = true;

			const {cursorPosition} = this.calMousePosition(e);

			// console.log('cursorPosition: ', cursorPosition);

			if (this.isDblMouseDown === true
				&& this.lastMouseDownTimestamp && timestamp - this.lastMouseDownTimestamp < 300) { // 已经是双击状态并且小于300ms认为是三击

				this.isTplMouseDown = true;

				const text = this.props.editorData.split('\n')[cursorPosition.line];

				let start = Object.assign({}, cursorPosition),
					stop = Object.assign({}, cursorPosition),
					cursor = Object.assign({}, cursorPosition);

				start.col = 0;
				start.left = 0;
				stop.col = text.length;
				stop.left = this.props.contentSize.width + this.props.editorConfig.horizonPadding + this.props.editorConfig.scrollbarWidth;
				cursor.col = text.length;
				cursor.left = this.props.getStringSize(text);

				// console.log('start: ', start, 'stop: ', stop);

				this.setState({
					isFocused: true,
					selectionStartPosition: start,
					selectionStopPosition: stop,
					cursorPosition: cursor
				});

			} else if (this.lastMouseDownTimestamp && timestamp - this.lastMouseDownTimestamp < 300
				&& cursorPosition.line === this.state.selectionStartPosition.line
				&& cursorPosition.col === this.state.selectionStartPosition.col) { // 小于300ms并且点击位置相同认为是双击

				this.isDblMouseDown = true;

				const text = this.props.editorData.split('\n')[cursorPosition.line];

				let start = Object.assign({}, cursorPosition),
					stop = Object.assign({}, cursorPosition);

				for (let i = cursorPosition.col - 1; i >= 0; i--) {
					if (this.discontinuousChars.indexOf(text.at(i)) != -1) {
						break;
					} else {
						start.col = i;
					}
				}
				start.left -= this.props.getStringSize(text.substring(start.col, cursorPosition.col));

				for (let i = cursorPosition.col, len = text.length; i < len; i++) {
					if (this.discontinuousChars.indexOf(text.at(i)) != -1) {
						break;
					} else {
						stop.col = i + 1;
					}
				}
				stop.left += this.props.getStringSize(text.substring(cursorPosition.col, stop.col));

				if (start.col === stop.col) { // 未选中文本
					start.col--;
					start.left -= this.props.getStringSize(text.substring(start.col - 1, start.col));
				}

				this.setState({
					isFocused: true,
					selectionStartPosition: start,
					selectionStopPosition: stop,
					cursorPosition: stop
				});

			} else { // 非双击和三击

				this.isDblMouseDown = false;
				this.isTplMouseDown = false;

				if (e.shiftKey !== true) {
					this.setState({
						isFocused: true,
						selectionStartPosition: cursorPosition,
						selectionStopPosition: null,
						cursorPosition: cursorPosition
					});
				}

			}

		} else {
			this.mouseDown = false;
			this.setState({
				isFocused: false
			});
		}

		this.lastMouseDownTimestamp = timestamp;

	}

	/**
	 * mousemove 处理
	 * 设置鼠标截止位置和光标截止位置
	 * @param e
	 */
	mousemoveHandle(e) {

		// console.log(e);

		if (this.mouseDown == true) {

			const {cursorPosition} = this.calMousePosition(e);

			// console.log('cursorPosition: ', cursorPosition);

			this.setState({
				selectionStopPosition: cursorPosition,
				cursorPosition: cursorPosition
			});

		}

	}

	/**
	 * mouseup 处理
	 * 设置鼠标截止位置和光标截止位置
	 * @param e
	 */
	mouseupHandle(e) {

		// console.log(e);

		this.mouseDown = false;

		if (this.props.scrolling == false && this.isDblMouseDown == false && this.isTplMouseDown == false) {

			const {cursorPosition} = this.calMousePosition(e);

			this.setState({
				selectionStopPosition: cursorPosition,
				cursorPosition: cursorPosition
			});

		}

	}

	/**
	 * 对两个光标位置进行排序
	 * @returns {
	 *     start 起始位置
	 *     end 截止位置
	 * }
	 */
	sortCursorPosition(startPos, stopPos) {
		if (startPos.line == stopPos.line) { // 选中文本在同一行
			if (startPos.col < stopPos.col) {
				return {
					start: startPos,
					stop: stopPos
				};
			} else {
				return {
					start: stopPos,
					stop: startPos
				};
			}
		} else { // 不在同一行
			if (startPos.line < stopPos.line) {
				return {
					start: startPos,
					stop: stopPos
				};
			} else {
				return {
					start: stopPos,
					stop: startPos
				};
			}
		}
	}

	/**
	 * 替换文本
	 * @param start 文本起始位置
	 * @param stop 文本截止位置
	 * @param text 替换的文本
	 * @returns 新的数组数据
	 */
	replaceText(start, stop, text) {

		let arrayData = this.props.editorData.split('\n');

		if (start.line == stop.line && start.line in arrayData
			&& start.col >= 0 && stop.col <= arrayData[start.line].length) { // 单行

			let temp = arrayData[start.line];
			arrayData[start.line] = temp.substring(0, start.col) + text + temp.substring(stop.col);

		} else if (start.line in arrayData && stop.line in arrayData
			&& start.col >= 0 && start.col <= arrayData[start.line].length
			&& stop.col >= 0 && stop.col <= arrayData[stop.line].length) { // 多行

			let last = '';
			for (let i = stop.line; i >= start.line; i--) {
				if (i == start.line) { // 第一行
					arrayData[start.line] = arrayData[start.line].substring(0, start.col) + text + last;
				} else if (i == stop.line) { // 最后一行
					last = arrayData[stop.line].substring(stop.col);
					arrayData.splice(stop.line, 1);
				} else {
					arrayData.splice(i, 1);
				}
			}

		}

		return arrayData;

	}

	/**
	 * 快捷键处理
	 * @param e
	 */
	keyDownHandle(e) {
		console.log(e);
	}

	/**
	 * 文本修改处理
	 * 设置新的文本数据，设置光标的位置
	 * @param inputData 输入的文本
	 * @param backspace 是否是退格
	 */
	textChangedHandle(inputData, backspace) {

		backspace = !!backspace;

		let arrayData = this.props.editorData.split('\n'),
			selectionStartPos = Object.assign({
				top: 0,
				left: 0,
				line: 0,
				col: 0
			}, this.state.selectionStartPosition || {}),
			selectionStopPos = Object.assign({
				top: 0,
				left: 0,
				line: 0,
				col: 0
			}, this.state.selectionStopPosition || {}),
			// cursorPos = Object.assign({
			// 	top: 0,
			// 	left: 0,
			// 	line: 0,
			// 	col: 0
			// }, this.state.selectionStopPosition || this.state.selectionStartPosition || {}),
			{start, stop} = this.sortCursorPosition(selectionStartPos, selectionStopPos); // 计算出修改文本前的起始截止光标位置

		// 计算新文本
		if (backspace && start.line == stop.line && start.col == stop.col) { // 未选中文本时的回退
			if (start.line == 0 && start.col == 0) {
				//
			} else if (start.line != 0 && start.col == 0) {
				start.line--;
				start.col = arrayData[start.line].length;
				arrayData = this.replaceText(start, stop, inputData);
			} else {
				start.col--;
				arrayData = this.replaceText(start, stop, inputData);
			}
		} else { // 替换文本
			arrayData = this.replaceText(start, stop, inputData);
		}

		// 计算新的光标位置
		if (!backspace) {
			for (let i = 0, len = inputData.length; i < len; i++) {
				let char = inputData.charAt(i);
				if (char == '\n') {
					start.top += this.props.editorConfig.lineHeight;
					start.left = 0;
					start.line++;
					start.col = 0;
				} else {
					start.left += this.props.getCharSize(char);
					start.col++;
				}
			}
		} else {
			start.top = start.line * this.props.editorConfig.lineHeight;
			start.left = this.props.getStringSize(arrayData[start.line] ? arrayData[start.line].substring(0, start.col) : '');
		}

		let scrollTop, scrollLeft;
		// 当光标位置离顶部的距离小于一行的高度时，滚动 Editor 保证光标上方还能显示完整的一行
		if (start.top - this.props.scroll.top < this.props.editorConfig.lineHeight) {
			scrollTop = start.top - this.props.editorConfig.lineHeight;
		}
		// 当光标位置离底部的距离小于两行的高度时，滚动 Editor 保证光标下方还能显示完整的一行
		if (start.top - this.props.scroll.top + this.props.editorConfig.lineHeight * 2 > this.props.editorSize.height) {
			scrollTop = start.top - this.props.editorSize.height + this.props.editorConfig.lineHeight * 2;
		}
		// 当光标位置离左边小于最小偏移量时，滚动 Editor 至最左
		if (start.left - this.props.scroll.left < 0) {
			scrollLeft = start.left;
		}
		// 当光标位置大于 Editor 宽度，滚动 Editor 至位置
		if (start.left - this.props.scroll.left * 2 + this.props.editorConfig.scrollbarWidth > this.props.editorSize.width) {
			scrollLeft = start.left + this.props.editorConfig.scrollbarWidth - this.props.editorSize.width;
		}
		let newLineWidth = this.props.getStringSize(arrayData[start.line]);
		if (newLineWidth <= this.props.contentSize.baseWidth) {
			newLineWidth = null;
		}

		this.setState({
			selectionStartPosition: start,
			selectionStopPosition: start,
			cursorPosition: start
		}, ()=> {
			this.props.onTextChanged(arrayData.join('\n'), scrollTop, scrollLeft, newLineWidth);
		});

	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.editorData !== this.props.editorData
			|| nextProps.filterText !== this.props.filterText
			|| nextProps.editorSize.width !== this.props.editorSize.width
			|| nextProps.editorSize.height !== this.props.editorSize.height
			|| nextProps.scroll.top !== this.props.scroll.top
			|| nextProps.scroll.left !== this.props.scroll.left
			|| nextProps.scrolling !== this.props.scrolling
			|| nextState.isFocused
			|| nextState.isFocused !== this.state.isFocused
			|| (
				nextState.selectionStartPosition && this.state.selectionStartPosition
				&& (nextState.selectionStartPosition.top !== this.state.selectionStartPosition.top
				|| nextState.selectionStartPosition.left !== this.state.selectionStartPosition.left)
			)
			|| (
				nextState.selectionStopPosition && this.state.selectionStopPosition
				&& (nextState.selectionStopPosition.top !== this.state.selectionStopPosition.top
				|| nextState.selectionStopPosition.left !== this.state.selectionStopPosition.left)
			);
	}

	componentDidMount() {
		window.addEventListener('mousedown', this.mousedownHandle);
		window.addEventListener('mousemove', this.mousemoveHandle);
		window.addEventListener('mouseup', this.mouseupHandle);
	}

	componentWillUnmount() {
		window.removeEventListener('mousedown', this.mousedownHandle);
		window.removeEventListener('mousemove', this.mousemoveHandle);
		window.removeEventListener('mouseup', this.mouseupHandle);
	}

	render() {

		// console.log('EditorScroller render');

		const {editorData, filterText, editorSize, editorConfig, contentSize, scroll, scrolling} = this.props;
		const {isFocused, selectionStartPosition, selectionStopPosition, cursorPosition} = this.state;
		const {calDisplayIndex, textChangedHandle, keyDownHandle} = this;

		const scrollerStyle = {
			width: contentSize.width || '100%',
			height: editorSize.height,
			left: editorConfig.horizonPadding - scroll.left
		};

		// const contentStyle = {
		// 	width: contentSize.width || 0,
		// 	height: contentSize.height || 0
		// };

		const displayIndex = calDisplayIndex(editorData.split('\n'), scroll.top);

		// 选择起始坐标
		let selectionStartPos = selectionStartPosition;
		if (selectionStartPos) {
			selectionStartPos = Object.assign({
				top: 0,
				left: 0,
				line: 0,
				col: 0
			}, selectionStartPos || {});
			selectionStartPos.top -= scroll.top;
			// selectionStartPos.left -= scroll.left;
		}

		// 选择结束坐标
		let selectionStopPos = selectionStopPosition;
		if (selectionStopPos) {
			selectionStopPos = Object.assign({
				top: 0,
				left: 0,
				line: 0,
				col: 0
			}, selectionStopPos || {});
			selectionStopPos.top -= scroll.top;
			// selectionStopPos.left -= scroll.left;
		}

		// 当前光标的坐标
		let cursorPos = Object.assign({
			top: 0,
			left: 0,
			line: 0,
			col: 0
		}, cursorPosition || {});
		cursorPos.top -= scroll.top;
		// cursorPos.left -= scroll.left;

		return (
			<div ref="scroller"
			     className="scroller"
			     style={scrollerStyle}>

				{/*<div ref="scrollerContent"
				 className="scroller-content"
				 style={contentStyle}>*/}

				{/** 输入用的文本框 */}
				<EditorScrollerTextInput editorData={editorData}
				                         isFocused={isFocused}
				                         cursorPos={cursorPos}
				                         onTextChanged={textChangedHandle}/>

				{/** 选中文本背景和鼠标所在行背景 */}
				<EditorScrollerMarkerLayer editorConfig={editorConfig}
				                           editorSize={editorSize}
				                           selectionStartPosition={selectionStartPos}
				                           selectionStopPosition={selectionStopPos}
				                           cursorPosition={cursorPos}
				                           displayIndex={displayIndex}
				                           contentSize={contentSize}/>

				{/** 文本 */}
				<EditorScrollerTextLayer editorData={editorData}
				                         filterText={filterText}
				                         editorConfig={editorConfig}
				                         editorSize={editorSize}
				                         scroll={scroll}
				                         displayIndex={displayIndex}
				                         contentSize={contentSize}/>

				{/** 光标 */}
				<EditorScrollerCursorLayer editorConfig={editorConfig}
				                           editorSize={editorSize}
				                           isFocused={isFocused}
				                           cursorPosition={cursorPos}
				                           contentSize={contentSize}
				                           scrolling={scrolling}
				                           scroll={scroll}/>

				{/*</div>*/}

			</div>
		);

	}
};

EditorScroller.propTypes = {

	// Editor
	editorData: PropTypes.string,
	filterText: PropTypes.string,
	editorSize: PropTypes.object,
	editorConfig: PropTypes.object,
	getCharSize: PropTypes.func,
	getStringSize: PropTypes.func,
	getTextCursorPosition: PropTypes.func,
	contentSize: PropTypes.object,
	scrolling: PropTypes.bool,
	scroll: PropTypes.object,
	onTextChanged: PropTypes.func

};