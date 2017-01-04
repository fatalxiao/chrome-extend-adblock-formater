import React, {Component, PropTypes} from 'react';

export default class EditorScrollerCursorLayer extends Component {

	constructor(props) {

		super(props);

		this.cursorActived = true;
		this.activeInterval = null;

	}

	cursorBlink() {
		const cursor = this.refs.cursor;
		this.cursorActived = true;
		cursor.style.opacity = 1;
		this.activeInterval = setInterval(()=> {
			this.cursorActived = !this.cursorActived;
			cursor.style.opacity = this.cursorActived ? 1 : 0;
		}, 500);
	}

	displayCursor(props) {
		clearInterval(this.activeInterval);
		if (props.isFocused == true) {
			this.cursorBlink();
		} else {
			this.refs.cursor.style.opacity = .2;
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.editorConfig.lineHeight !== this.props.editorConfig.lineHeight
			|| nextProps.cursorPosition.top !== this.props.cursorPosition.top
			|| nextProps.cursorPosition.left !== this.props.cursorPosition.left;
	}

	componentWillReceiveProps(nextProps) {
		this.displayCursor(nextProps);
	}

	componentDidMount() {
		this.displayCursor(this.props);
	}

	render() {

		// console.log('EditorScrollerCursorLayer render');

		const {editorConfig, editorSize, cursorPosition, contentSize} = this.props;

		// console.log(cursorPosition);

		const layerStyle = {
			width: contentSize.width,
			height: editorSize.height
		};

		const cursorStyle = {
			top: cursorPosition.top,
			left: cursorPosition.left,
			height: editorConfig.lineHeight
		};

		return (
			<div className="layer cursor-layer"
			     style={layerStyle}>

				<div ref="cursor"
				     className="cursor"
				     style={cursorStyle}></div>

			</div>
		);

	}
};

EditorScrollerCursorLayer.propTypes = {

	// EditorScroller
	editorConfig: PropTypes.object,
	editorSize: PropTypes.object,
	isFocused: PropTypes.bool,
	cursorPosition: PropTypes.object,
	scroll: PropTypes.object,
	contentSize: PropTypes.object

};