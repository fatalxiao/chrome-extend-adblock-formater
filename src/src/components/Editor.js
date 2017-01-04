import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import Util from '../vendor/Util';
import EditorGutter from './EditorGutter';
import EditorScroller from './EditorScroller';
import EditorScrollbar from './EditorScrollbar';

import '../assets/stylesheets/Editor.css';

@pureRender
export default class Editor extends Component {

	constructor(props) {

		super(props);

		this.charCount = null;
		this.charSize = {};
		this.defaultConfig = {
			lineHeight: 20,
			fontSize: 16,
			horizonPadding: 4,
			scrollbarWidth: 10,
			scrollbarMaxLength: 10,
			scrollbarAnimationTime: 1000,
			scrollbarAnimationJump: false
		};
		this.editorConfig = Object.assign({}, this.defaultConfig);

		this.state = {
			historyData: [this.props.value],
			contentSize: {
				width: 0,
				height: 0
			},
			scrolling: false,
			scroll: {
				top: 0,
				left: 0
			}
		};

		this.getCharSize = this.getCharSize.bind(this);
		this.getStringSize = this.getStringSize.bind(this);
		this.getTextCursorPosition = this.getTextCursorPosition.bind(this);
		this.calContentSize = this.calContentSize.bind(this);
		this.startScroll = this.startScroll.bind(this);
		this.endScroll = this.endScroll.bind(this);
		this.scrollX = this.scrollX.bind(this);
		this.scrollY = this.scrollY.bind(this);
		this.preventDrag = this.preventDrag.bind(this);
		this.textChanged = this.textChanged.bind(this);

	}

	/**
	 * 获取单个字符的宽度
	 * @param char
	 * @returns {*}
	 */
	getCharSize(char) {

		if (char in this.charSize) {
			return this.charSize[char];
		}

		const component = this.refs.testCharWidthDiv;
		if (!this.charCount) {
			this.charCount = Util.computerCharCount();
		}
		component.innerHTML = char.repeat(this.charCount);

		return this.charSize[char] = component.getBoundingClientRect().width / this.charCount;
	}

	getStringSize(string) {
		let width = 0;
		if (string) {
			for (let i = 0, len = string.length; i < len; i++) {
				width += this.getCharSize(string.charAt(i));
			}
		}
		return width;
	}

	/**
	 * 计算光标在文本上的真实位置
	 * @param text
	 * @param offset
	 * @returns {*}
	 */
	getTextCursorPosition(text, offset) {

		if (!text || !offset || isNaN(offset) || offset < 0) {
			return {
				len: 0,
				index: 0
			};
		}

		let curr, next;

		for (let char of text) {

			if (!curr && !next) {
				curr = {
					len: 0,
					index: 0
				};
				next = {
					len: this.getCharSize(char),
					index: 1
				};
			} else {
				curr = Object.assign({}, next);
				next.len += this.getCharSize(char);
				next.index++;
			}

			if (curr.len == offset) {
				return curr;
			} else if (next.len == offset) {
				return next;
			} else if (curr.len < offset && next.len > offset) {
				if (Math.abs(curr.len - offset) <= Math.abs(next.len - offset)) {
					return curr;
				} else {
					return next;
				}
			}

		}

		return next;

	}

	/**
	 * 计算某一行的宽度
	 * @param text
	 * @returns {Number}
	 */
	// testTextWidth(text) {
	// 	const component = this.refs.testCharWidthDiv;
	// 	component.innerHTML = text;
	// 	return component.getBoundingClientRect().width;
	// }

	/**
	 * 获取内容中最大的行宽
	 * @param dataArray
	 * @returns {number}
	 */
	getMaxLineWidth(dataArray) {
		let max = 0;

		// console.log('testTextWidth: ', this.testTextWidth(dataArray[0]));
		// console.log('getStringSize: ', this.getStringSize(dataArray[0]));

		for (let text of dataArray) {
			if (text && text.length > 0) {
				let width = this.getStringSize(text);
				if (width > max) {
					max = width;
				}
			}
		}
		return max;
	}

	/**
	 * 计算内容的尺寸
	 * @param props
	 */
	calContentSize(value, height) {

		// console.log(value)

		if (value && value.length > 0) {
			const data = value.split('\n');

			/**
			 * width: 内容宽度包括水平padding和垂直滚动条的宽度
			 * height: 内容高度包括水平滚动条宽度，同时为了可以滚动到只剩最后一行要加上编辑器高度减去行高
			 */
			const baseWidth = this.getMaxLineWidth(data),
				baseHeight = data.length * this.editorConfig.lineHeight;
			this.setState({
				contentSize: {
					baseWidth,
					baseHeight,
					width: baseWidth + 2 * this.editorConfig.horizonPadding + this.editorConfig.scrollbarWidth,
					height: baseHeight + height - this.editorConfig.lineHeight + this.editorConfig.scrollbarWidth
				}
			});
		} else {
			this.setState({
				contentSize: {
					baseWidth: 0,
					baseHeight: 0,
					width: 0,
					height: 0
				}
			});
		}

	}

	/**
	 * 开始滚动
	 */
	startScroll() {
		this.setState({
			scrolling: true
		});
	}

	/**
	 * 结束滚动
	 */
	endScroll() {
		this.setState({
			scrolling: false
		});
	}

	/**
	 * 水平滚动到某个位置
	 * @param left
	 */
	scrollX(left) {
		const scroll = this.state.scroll;
		this.setState({
			scroll: {
				top: scroll.top,
				left
			}
		});
	}

	/**
	 * 垂直滚动到某个位置
	 * @param top
	 */
	scrollY(top) {
		const scroll = this.state.scroll;
		this.setState({
			scroll: {
				top,
				left: scroll.left
			}
		});
	}

	preventDrag(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	textChanged(newValue, scrollTop, scrollLeft, newLineWidth) {

		let data = this.state.historyData.slice();
		data.push(newValue);

		let state = {
			historyData: data,
			scroll: {
				top: !isNaN(scrollTop) ? scrollTop : this.state.scroll.top,
				left: !isNaN(scrollLeft) ? scrollLeft : this.state.scroll.left
			}
		};

		if (newLineWidth) {
			let baseWidth = newLineWidth,
				baseHeight = newValue.split('\n').length * this.editorConfig.lineHeight
			state.contentSize = {
				baseWidth,
				baseHeight,
				width: baseWidth + 2 * this.editorConfig.horizonPadding + this.editorConfig.scrollbarWidth,
				height: baseHeight + this.props.height - this.editorConfig.lineHeight + this.editorConfig.scrollbarWidth
			};
		}

		this.setState(state, ()=> {
			this.calContentSize(newValue, this.props.height);
		});

	}

	componentWillReceiveProps(nextProps) {
		this.editorConfig = Object.assign(Object.assign({}, this.defaultConfig), nextProps.options);
		if (nextProps.editorData && nextProps.editorData !== this.props.editorData) {
			this.calContentSize(nextProps.value, nextProps.height);
		}
		this.setState({
			historyData: [this.props.value]
		});
	}

	componentDidMount() {

		this.editorConfig = Object.assign(Object.assign({}, this.defaultConfig), this.props.options);
		setTimeout(()=> {
			this.calContentSize(this.props.value, this.props.height);
		}, 0);

		window.addEventListener('dragstart', this.preventDrag);

	}

	componentWillUnmount() {
		window.removeEventListener('dragstart', this.preventDrag);
	}

	render() {

		const {className, options, width, height} = this.props;
		const {contentSize, scrolling, scroll, historyData} = this.state;
		const {
			defaultConfig, getTextCursorPosition, editorConfig, startScroll, endScroll,
			scrollX, scrollY, textChanged, getCharSize, getStringSize
		} = this;

		const editorSize = {
			width,
			height
		};

		return (
			<div className={'Editor' + ' '
			+ (className ? '' + className : '') + ' '
			+ ('gutter-' + (options.gutterPosition == 'right' ? 'right' : 'left'))}
			     style={editorSize}>

				{/** 侧面工具条 */}
				<EditorGutter/>

				{/** 编辑器内容 */}
				<EditorScroller editorData={historyData[historyData.length - 1]}
				                filterText={''}
				                editorSize={editorSize}
				                editorConfig={editorConfig}
				                getCharSize={getCharSize}
				                getStringSize={getStringSize}
				                getTextCursorPosition={getTextCursorPosition}
				                contentSize={contentSize}
				                scrolling={scrolling}
				                scroll={scroll}
				                onTextChanged={textChanged}/>

				{/** 滚动条 */}
				<EditorScrollbar editorSize={editorSize}
				                 contentSize={contentSize}
				                 editorConfig={editorConfig}
				                 startScroll={startScroll}
				                 endScroll={endScroll}
				                 scroll={scroll}
				                 scrollX={scrollX}
				                 scrollY={scrollY}/>

				{/** 测试字符宽度用 */}
				<div ref="testCharWidthDiv"
				     className="testCharWidthDiv"
				     style={{fontSize: defaultConfig.fontSize}}></div>

			</div>
		);

	}
};

Editor.propTypes = {

	// App
	className: PropTypes.string,
	value: PropTypes.string,
	width: PropTypes.number,
	height: PropTypes.number,

	// options
	options: PropTypes.object

};