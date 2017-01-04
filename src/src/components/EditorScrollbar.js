import React, {Component, PropTypes} from 'react';

export default class EditorScrollbar extends Component {

	constructor(props) {
		super(props);

		this.scrollbarMinLen = 100;

		/**
		 * 水平滚动条样式相关信息
		 * @type object
		 */
		this.xStyle = {

			/**
			 * 水平滚动条宽度
			 * @type number
			 */
			wrapWidth: 0,

			/**
			 * 水平滚动条滑块宽度
			 * @type number
			 */
			width: 0,

			/**
			 * 水平滚动条滑块偏移
			 * @type number
			 */
			left: 0

		};

		/**
		 * 垂直滚动条样式相关信息
		 * @type object
		 */
		this.yStyle = {

			/**
			 * 垂直滚动条高度
			 * @type number
			 */
			wrapHeight: 0,

			/**
			 * 垂直滚动条滑块高度
			 * @type number
			 */
			height: 0,

			/**
			 * 垂直滚动条滑块偏移
			 * @type number
			 */
			top: 0

		};

		/**
		 * 水平滚动条滑块拖拽信息
		 * @type object
		 */
		this.xDrag = {

			/**
			 * 水平滚动条滑块是否 mouse down
			 * @type boolean
			 */
			mouseDown: false,

			/**
			 * 水平滚动条滑块 mouse down 时相对于文档的偏移
			 * @type number
			 */
			left: 0,

			/**
			 * 水平滚动条滑块 mouse down 时滑块的偏移
			 * @type number | null
			 */
			mouseDownOffset: null

		};

		/**
		 * 垂直滚动条滑块拖拽信息
		 * @type object
		 */
		this.yDrag = {

			/**
			 * 垂直滚动条滑块是否 mouse down
			 * @type boolean
			 */
			mouseDown: false,

			/**
			 * 垂直滚动条滑块 mouse down 时相对于文档的偏移
			 * @type number
			 */
			top: 0,

			/**
			 * 垂直滚动条滑块 mouse down 时滑块的偏移
			 * @type number | null
			 */
			mouseDownOffset: null

		};

		this.xWrap = {
			scrollAnimateFrame: null,
			mouseDown: false,
			mouseDownTimestamp: 0
		};

		this.yWrap = {
			scrollAnimateFrame: null,
			mouseDown: false,
			mouseDownTimestamp: 0
		};

		/**
		 * 文档的滚动偏移
		 * @type object
		 */
		this.scroll = {
			top: 0,
			left: 0
		};

		this.validXScrollbarData = this.validXScrollbarData.bind(this);
		this.validYScrollbarData = this.validYScrollbarData.bind(this);
		this.offestLeft2ScrollLeft = this.offestLeft2ScrollLeft.bind(this);
		this.scrollLeft2OffestLeft = this.scrollLeft2OffestLeft.bind(this);
		this.offestTop2ScrollTop = this.offestTop2ScrollTop.bind(this);
		this.scrollTop2OffestTop = this.scrollTop2OffestTop.bind(this);
		this.calScrollbarData = this.calScrollbarData.bind(this);
		this.mouseMoveHandle = this.mouseMoveHandle.bind(this);
		this.mouseUpHandle = this.mouseUpHandle.bind(this);
		this.wheelHandle = this.wheelHandle.bind(this);

		this.xAnimate = this.xAnimate.bind(this);
		this.xWrapMouseOverHandle = this.xWrapMouseOverHandle.bind(this);
		this.xWrapMouseOutHandle = this.xWrapMouseOutHandle.bind(this);
		this.xWrapMouseDownHandle = this.xWrapMouseDownHandle.bind(this);
		this.xMouseOverHandle = this.xMouseOverHandle.bind(this);
		this.xMouseOutHandle = this.xMouseOutHandle.bind(this);
		this.xMouseDownHandle = this.xMouseDownHandle.bind(this);

		this.yAnimate = this.yAnimate.bind(this);
		this.yWrapMouseOverHandle = this.yWrapMouseOverHandle.bind(this);
		this.yWrapMouseOutHandle = this.yWrapMouseOutHandle.bind(this);
		this.yWrapMouseDownHandle = this.yWrapMouseDownHandle.bind(this);
		this.yMouseOverHandle = this.yMouseOverHandle.bind(this);
		this.yMouseOutHandle = this.yMouseOutHandle.bind(this);
		this.yMouseDownHandle = this.yMouseDownHandle.bind(this);
	}

	/**
	 * 验证水平滚动条位置，并返回合法的位置
	 * @param props
	 * @param width
	 * @param left
	 * @returns {*}
	 */
	validXScrollbarData(props, width, left) {

		const max = this.xStyle.wrapWidth - width;
		left = left >= 0 ? left : 0;
		left = left <= max ? left : max;

		return left;

	}

	/**
	 * 验证垂直滚动条位置，并返回合法的位置
	 * @param props
	 * @param height
	 * @param top
	 * @returns {*}
	 */
	validYScrollbarData(props, height, top) {

		const max = this.yStyle.wrapHeight - height;
		top = top >= 0 ? top : 0;
		top = top <= max ? top : max;

		return top;

	}

	/**
	 * 水平滚动条偏移 转换成 内容水平偏移
	 * @param props
	 * @param left
	 * @returns {number}
	 */
	offestLeft2ScrollLeft(props, left) {

		const {contentSize} = props;

		return contentSize.width > this.xStyle.wrapWidth ?
		left * (contentSize.width - this.xStyle.wrapWidth) / (this.xStyle.wrapWidth - this.xStyle.width)
			:
			0;

	}

	/**
	 * 内容水平偏移 转换成 水平滚动条偏移
	 * @param props
	 * @param left
	 * @returns {number}
	 */
	scrollLeft2OffestLeft(props, left) {

		const {contentSize, editorSize} = props;
		const {xStyle, validXScrollbarData} = this;

		return validXScrollbarData(props, xStyle.width,
			left * (xStyle.wrapWidth - xStyle.width) / (contentSize.width - xStyle.wrapWidth));

	}

	/**
	 * 垂直滚动条偏移 转换成 内容垂直偏移
	 * @param props
	 * @param left
	 * @returns {number}
	 */
	offestTop2ScrollTop(props, top) {

		const {editorSize, contentSize, editorConfig} = props;

		return contentSize.height > this.yStyle.wrapHeight - editorConfig.scrollbarWidth ?
		top * (contentSize.height - this.yStyle.wrapHeight - editorConfig.scrollbarWidth) / (this.yStyle.wrapHeight - this.yStyle.height)
			:
			0;

	}

	/**
	 * 内容垂直偏移 转换成 垂直滚动条偏移
	 * @param props
	 * @param left
	 * @returns {number}
	 */
	scrollTop2OffestTop(props, top) {

		const {contentSize} = props;
		const {yStyle, validYScrollbarData} = this;

		return validYScrollbarData(props, yStyle.height,
			top * (yStyle.wrapHeight - yStyle.height) / (contentSize.height - yStyle.wrapHeight));

	}

	/**
	 * 计算滚动条数据（水平滚动条宽度、偏移，垂直滚动条高度、偏移）
	 * @param props
	 */
	calScrollbarData(props) {

		const {editorSize, contentSize, scroll, editorConfig} = props;

		if (editorSize && contentSize) {

			if (!isNaN(this.scroll.left) && !isNaN(editorSize.width) && !isNaN(contentSize.width)) {

				let wrapWidth = editorSize.width - 2 * editorConfig.horizonPadding - editorConfig.scrollbarWidth;
				wrapWidth = wrapWidth > 0 ? wrapWidth : 0;
				let width = contentSize.width != 0 ? wrapWidth * wrapWidth / contentSize.width : 0;
				width = width > this.scrollbarMinLen ? width : this.scrollbarMinLen;
				const left = this.validXScrollbarData(props, width, this.scroll.left * (wrapWidth - width) / (contentSize.width - wrapWidth));

				this.xStyle = {
					wrapWidth: wrapWidth,
					width,
					left
				};

			}

			if (!isNaN(this.scroll.top) && !isNaN(editorSize.height) && !isNaN(contentSize.height)) {

				let height = contentSize.height != 0 ? editorSize.height * editorSize.height / contentSize.height : 0;
				height = height > this.scrollbarMinLen ? height : this.scrollbarMinLen;
				const top = this.validYScrollbarData(props, height, this.scroll.top * (editorSize.height - height) / (contentSize.height - editorSize.height));

				this.yStyle = {
					wrapHeight: editorSize.height,
					height,
					top
				};

			}

		}

	}

	/**
	 * 水平滚动条 mouse over 事件处理
	 * @param e
	 */
	xWrapMouseOverHandle(e) {
		e.stopPropagation();
		e.target.className = 'scrollbar-wrap scrollbar-wrap-x active';
	}

	/**
	 * 水平滚动条 mouse out 事件处理
	 * @param e
	 */
	xWrapMouseOutHandle(e) {
		e.stopPropagation();
		if (this.xDrag.mouseDown != true) {
			e.target.className = 'scrollbar-wrap scrollbar-wrap-x deactive';
		}
	}

	/**
	 * 水平滚动条滑块 mouse over 事件处理
	 * @param e
	 */
	xMouseOverHandle(e) {
		e.stopPropagation();
		e.target.className = 'scrollbar scrollbar-x active';
		e.target.parentElement.className = 'scrollbar-wrap scrollbar-wrap-x active';
	}

	/**
	 * 水平滚动条滑块 mouse out 事件处理
	 * @param e
	 */
	xMouseOutHandle(e) {
		e.stopPropagation();
		if (this.xDrag.mouseDown != true) {
			e.target.className = 'scrollbar scrollbar-x deactive';
			e.target.parentElement.className = 'scrollbar-wrap scrollbar-wrap-x deactive';
		}
	}

	/**
	 * 水平滚动条 mouse down 时，滑块动画移动至目标位置
	 */
	xAnimate() {

		const {editorConfig, scrollX} = this.props,
			{xWrap, scroll, offestLeft2ScrollLeft, validXScrollbarData, xStyle} = this,
			scrollbarX = this.refs.scrollbarX,
			timeOffset = new Date().getTime() - xWrap.mouseDownTimestamp,
			stop = validXScrollbarData(this.props, xStyle.width, xWrap.mouseDownOffset - xStyle.width / 2);

		let left;

		if (timeOffset >= editorConfig.scrollbarAnimationTime) {
			left = stop;
		} else {
			const percent = timeOffset / editorConfig.scrollbarAnimationTime,
				start = xWrap.left;
			left = start + percent * (stop - start);
		}

		left = validXScrollbarData(this.props, xStyle.width, left);
		xStyle.left = left;
		scrollbarX.style.left = left + 'px';

		const scrollTop = offestLeft2ScrollLeft(this.props, left);
		scroll.left = scrollTop;
		scrollX(scrollTop);

		xWrap.scrollAnimateFrame = requestAnimationFrame(this.xAnimate);

	}

	/**
	 * 水平滚动条 mouse down 事件处理
	 * @param e
	 */
	xWrapMouseDownHandle(e) {
		e.stopPropagation();
		this.xWrap.mouseDown = true;
		this.xWrap.left = this.xStyle.left;
		this.xWrap.mouseDownOffset = e.pageX;
		this.xWrap.mouseDownTimestamp = new Date().getTime();
		this.xWrap.scrollAnimateFrame = requestAnimationFrame(this.xAnimate);
		this.props.startScroll();
	}

	/**
	 * 水平滚动条滑块 mouse down 事件处理
	 * @param e
	 */
	xMouseDownHandle(e) {
		e.stopPropagation();
		this.xDrag.mouseDown = true;
		this.xDrag.left = this.xStyle.left;
		this.xDrag.mouseDownOffset = e.pageX;
		this.props.startScroll();
	}

	/**
	 * 垂直滚动条 mouse over 事件处理
	 * @param e
	 */
	yWrapMouseOverHandle(e) {
		e.stopPropagation();
		e.target.className = 'scrollbar-wrap scrollbar-wrap-y active';
	}

	/**
	 * 垂直滚动条 mouse out 事件处理
	 * @param e
	 */
	yWrapMouseOutHandle(e) {
		e.stopPropagation();
		if (this.yDrag.mouseDown != true) {
			e.target.className = 'scrollbar-wrap scrollbar-wrap-y deactive';
		}
	}

	/**
	 * 垂直滚动条滑块 mouse over 事件处理
	 * @param e
	 */
	yMouseOverHandle(e) {
		e.stopPropagation();
		e.target.className = 'scrollbar scrollbar-y active';
		e.target.parentElement.className = 'scrollbar-wrap scrollbar-wrap-y active';
	}

	/**
	 * 垂直滚动条滑块 mouse out 事件处理
	 * @param e
	 */
	yMouseOutHandle(e) {
		e.stopPropagation();
		if (this.yDrag.mouseDown != true) {
			e.target.className = 'scrollbar scrollbar-y deactive';
			e.target.parentElement.className = 'scrollbar-wrap scrollbar-wrap-y deactive';
		}
	}

	/**
	 * 垂直滚动条 mouse down 时，滑块动画移动至目标位置
	 */
	yAnimate() {

		const {editorConfig, scrollY} = this.props,
			{yWrap, scroll, offestTop2ScrollTop, validYScrollbarData, yStyle} = this,
			scrollbarY = this.refs.scrollbarY,
			timeOffset = new Date().getTime() - yWrap.mouseDownTimestamp,
			stop = validYScrollbarData(this.props, yStyle.height, yWrap.mouseDownOffset - yStyle.height / 2);

		let top;

		if (timeOffset >= editorConfig.scrollbarAnimationTime) {
			top = stop;
		} else {
			const percent = timeOffset / editorConfig.scrollbarAnimationTime,
				start = yWrap.top;
			top = start + percent * (stop - start);
		}

		top = validYScrollbarData(this.props, yStyle.height, top);
		yStyle.top = top;
		scrollbarY.style.top = top + 'px';

		const scrollTop = offestTop2ScrollTop(this.props, top);
		scroll.top = scrollTop;
		scrollY(scrollTop);

		yWrap.scrollAnimateFrame = requestAnimationFrame(this.yAnimate);

	}

	/**
	 * 垂直滚动条 mouse down 事件处理
	 * @param e
	 */
	yWrapMouseDownHandle(e) {
		e.stopPropagation();
		this.yWrap.mouseDown = true;
		this.yWrap.top = this.yStyle.top;
		this.yWrap.mouseDownOffset = e.pageY;
		this.yWrap.mouseDownTimestamp = new Date().getTime();
		this.yWrap.scrollAnimateFrame = requestAnimationFrame(this.yAnimate);
		this.props.startScroll();
	}

	/**
	 * 垂直滚动条滑块 mouse down 事件处理
	 * @param e
	 */
	yMouseDownHandle(e) {
		e.stopPropagation();
		this.yDrag.mouseDown = true;
		this.yDrag.top = this.yStyle.top;
		this.yDrag.mouseDownOffset = e.pageY;
		this.props.startScroll();
	}

	/**
	 * 滚动条滑块 mouse move 事件处理
	 * @param e
	 */
	mouseMoveHandle(e) {
		e.stopPropagation();
		if (this.xDrag.mouseDown == true) {
			const scrollbarX = this.refs.scrollbarX;
			this.xStyle.left = this.validXScrollbarData(this.props, this.xStyle.width, this.xDrag.left + e.pageX - this.xDrag.mouseDownOffset);
			scrollbarX.style.left = this.xStyle.left + 'px';
			const scrollLeft = this.offestLeft2ScrollLeft(this.props, this.xStyle.left);
			this.scroll.left = scrollLeft;
			this.props.scrollX(scrollLeft);
		} else if (this.yDrag.mouseDown == true) {
			const scrollbarY = this.refs.scrollbarY;
			this.yStyle.top = this.validYScrollbarData(this.props, this.yStyle.height, this.yDrag.top + e.pageY - this.yDrag.mouseDownOffset);
			scrollbarY.style.top = this.yStyle.top + 'px';
			const scrollTop = this.offestTop2ScrollTop(this.props, this.yStyle.top);
			this.scroll.top = scrollTop;
			this.props.scrollY(scrollTop);
		}
	}

	mouseUpHandle(e) {

		e.stopPropagation();

		const {scrollbarAnimationJump, scrollX, scrollY} = this.props,
			{
				xWrap, xStyle, validXScrollbarData, offestLeft2ScrollLeft, xDrag,
				yWrap, yStyle, validYScrollbarData, offestTop2ScrollTop, scroll, yDrag
			} = this,
			scrollbarWrapX = this.refs.scrollbarWrapX,
			scrollbarX = this.refs.scrollbarX,
			scrollbarWrapY = this.refs.scrollbarWrapY,
			scrollbarY = this.refs.scrollbarY;

		// 水平滚动条
		cancelAnimationFrame(xWrap.scrollAnimateFrame);
		if (scrollbarAnimationJump && xWrap.mouseDown == true) {

			let left = xWrap.mouseDownOffset - xStyle.width / 2;
			left = validXScrollbarData(this.props, xStyle.width, left);
			xStyle.left = left;
			scrollbarX.style.left = left + 'px';
			xWrap.mouseDown = false;

			const scrollLeft = offestLeft2ScrollLeft(this.props, left);
			this.scroll.left = scrollLeft;
			scrollX(scrollLeft);

		}

		// 垂直滚动条
		cancelAnimationFrame(yWrap.scrollAnimateFrame);
		if (scrollbarAnimationJump && yWrap.mouseDown == true) {

			let top = yWrap.mouseDownOffset - yStyle.height / 2;
			top = validYScrollbarData(this.props, yStyle.height, top);
			yStyle.top = top;
			scrollbarY.style.top = top + 'px';
			yWrap.mouseDown = false;

			const scrollTop = offestTop2ScrollTop(this.props, top);
			scroll.top = scrollTop;
			scrollY(scrollTop);

		}

		// 水平滚动条滑块
		if (xDrag.mouseDown == true) {
			xDrag.mouseDown = false;
		}
		// 垂直滚动条滑块
		if (yDrag.mouseDown == true) {
			yDrag.mouseDown = false;
		}

		// 水平滚动条样式处理
		if (e.target != scrollbarX && e.target != scrollbarWrapX) {
			scrollbarX.className = 'scrollbar scrollbar-x deactive';
			scrollbarWrapX.className = 'scrollbar-wrap scrollbar-wrap-x deactive';
		} else if (e.target != scrollbarX) {
			scrollbarX.className = 'scrollbar scrollbar-x deactive';
		}

		// 垂直滚动条样式处理
		if (e.target != scrollbarY && e.target != scrollbarWrapY) {
			scrollbarY.className = 'scrollbar scrollbar-y deactive';
			scrollbarWrapY.className = 'scrollbar-wrap scrollbar-wrap-y deactive';
		} else if (e.target != scrollbarY) {
			scrollbarY.className = 'scrollbar scrollbar-y deactive';
		}

		this.props.endScroll();

	}

	/**
	 * 滚轮事件处理
	 * @param e
	 */
	wheelHandle(e) {

		// console.log(e);

		let flag = false,
			editorEl = this.refs.layer.parentElement,
			target = e.target.parentElement;
		if (target.className.indexOf('Editor') != -1 && target == editorEl) {
			flag = true;
		} else {
			target = target.parentElement;
			if (target.className.indexOf('Editor') != -1 && target == editorEl) {
				flag = true;
			}
		}

		if (flag == true) {

			const {contentSize, editorConfig, editorSize} = this.props;

			const scrollbarY = this.refs.scrollbarY;
			let top = this.scroll.top + e.deltaY;
			const maxHeight = contentSize.baseHeight - editorConfig.lineHeight;
			top = top > maxHeight ? maxHeight : top;
			top = top < 0 ? 0 : top;
			this.scroll.top = top;
			scrollbarY.style.top = this.scrollTop2OffestTop(this.props, top) + 'px';
			// console.log(this.scrollTop2OffestTop(this.props, top));
			this.props.scrollY(top);

			const scrollbarX = this.refs.scrollbarX;
			let left = this.scroll.left + e.deltaX;
			const maxWidth = contentSize.width - editorSize.width + editorConfig.scrollbarWidth;
			left = left > maxWidth ? maxWidth : left;
			left = left < 0 ? 0 : left;
			this.scroll.left = left;
			scrollbarX.style.left = this.scrollLeft2OffestLeft(this.props, left) + 'px';
			this.props.scrollX(left);

		}

	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.editorSize.width !== this.props.editorSize.width
			|| nextProps.editorSize.height !== this.props.editorSize.height
			|| nextProps.contentSize.width !== this.props.contentSize.width
			|| nextProps.contentSize.height !== this.props.contentSize.height;
	}

	componentWillReceiveProps(nextProps) {

		this.calScrollbarData(nextProps);

		if (nextProps.scroll.top != this.scroll.top || nextProps.scroll.left != this.scroll.left) {

			const {contentSize, editorConfig, editorSize} = nextProps;
			this.scroll = {
				top: nextProps.scroll.top,
				left: nextProps.scroll.left
			};

			const scrollbarX = this.refs.scrollbarX;
			const maxWidth = contentSize.width - editorSize.width + editorConfig.scrollbarWidth;
			this.scroll.left = this.scroll.left > maxWidth ? maxWidth : this.scroll.left;
			this.scroll.left = this.scroll.left < 0 ? 0 : this.scroll.left;
			scrollbarX.style.left = this.scrollLeft2OffestLeft(nextProps, this.scroll.left) + 'px';

			const scrollbarY = this.refs.scrollbarY;
			const maxHeight = contentSize.baseHeight - editorConfig.lineHeight;
			this.scroll.top = this.scroll.top > maxHeight ? maxHeight : this.scroll.top;
			this.scroll.top = this.scroll.top < 0 ? 0 : this.scroll.top;
			scrollbarY.style.top = this.scrollTop2OffestTop(nextProps, this.scroll.top) + 'px';

		}

	}

	componentDidMount() {
		this.calScrollbarData(this.props);
		window.addEventListener('mousemove', this.mouseMoveHandle);
		window.addEventListener('mouseup', this.mouseUpHandle);
		window.addEventListener('wheel', this.wheelHandle);
	}

	componentWillUnmount() {
		window.removeEventListener('mousemove', this.mouseMoveHandle);
		window.removeEventListener('mouseup', this.mouseUpHandle);
		window.removeEventListener('wheel', this.wheelHandle);
	}

	render() {

		// console.log('EditorScrollbar render');

		const {editorSize, contentSize, editorConfig} = this.props;
		const {
			scroll,
			xStyle, xWrapMouseOverHandle, xWrapMouseOutHandle, xWrapMouseDownHandle, xMouseOverHandle, xMouseOutHandle, xMouseDownHandle,
			yStyle, yWrapMouseOverHandle, yWrapMouseOutHandle, yWrapMouseDownHandle, yMouseOverHandle, yMouseOutHandle, yMouseDownHandle
		} = this;

		return (
			<div ref="layer"
			     className="scrollbar-layer"
			     style={{
				     width: editorSize.width,
				     height: editorSize.height
			     }}>

				{/** 水平滚动条 */}
				{
					editorSize && contentSize && scroll && !isNaN(scroll.left) && !isNaN(editorSize.width) && !isNaN(contentSize.width) ?
						<div ref="scrollbarWrapX"
						     className="scrollbar-wrap scrollbar-wrap-x"
						     style={{
							     width: xStyle.wrapWidth,
							     height: editorConfig.scrollbarWidth,
							     left: editorConfig.horizonPadding
						     }}
						     onMouseOver={xWrapMouseOverHandle}
						     onMouseOut={xWrapMouseOutHandle}
						     onMouseDown={xWrapMouseDownHandle}>
							<div ref="scrollbarX"
							     className="scrollbar scrollbar-x"
							     style={{
								     width: xStyle.width,
								     height: editorConfig.scrollbarWidth,
								     left: xStyle.left
							     }}
							     onMouseOver={xMouseOverHandle}
							     onMouseOut={xMouseOutHandle}
							     onMouseDown={xMouseDownHandle}></div>
						</div>
						:
						null
				}

				{/** 垂直滚动条 */}
				{
					editorSize && contentSize && scroll && !isNaN(scroll.top) && !isNaN(editorSize.height) && !isNaN(contentSize.height) ?
						<div ref="scrollbarWrapY"
						     className="scrollbar-wrap scrollbar-wrap-y"
						     style={{
							     width: editorConfig.scrollbarWidth,
							     height: editorSize.height
						     }}
						     onMouseOver={yWrapMouseOverHandle}
						     onMouseOut={yWrapMouseOutHandle}
						     onMouseDown={yWrapMouseDownHandle}>
							<div ref="scrollbarY"
							     className="scrollbar scrollbar-y"
							     style={{
								     width: editorConfig.scrollbarWidth,
								     height: yStyle.height,
								     top: yStyle.top
							     }}
							     onMouseOver={yMouseOverHandle}
							     onMouseOut={yMouseOutHandle}
							     onMouseDown={yMouseDownHandle}></div>
						</div>
						:
						null
				}

			</div>
		);

	}
};

EditorScrollbar.propTypes = {

	// Editor
	editorSize: PropTypes.object,
	contentSize: PropTypes.object,
	startScroll: PropTypes.func,
	endScroll: PropTypes.func,
	scroll: PropTypes.object,
	scrollX: PropTypes.func,
	scrollY: PropTypes.func,
	editorConfig: PropTypes.object

};