import React, {Component, PropTypes} from 'react';

export default class EditorScrollerTextInput extends Component {

	constructor(props) {

		super(props);

		this.inputHandle = this.inputHandle.bind(this);
		this.keyDownHandle = this.keyDownHandle.bind(this);

	}

	inputHandle() {

		if (this.props.isFocused != true) {
			return;
		}

		const textInput = this.refs.textInput;
		this.props.onTextChanged(textInput.value);
		textInput.value = '';
		textInput.setSelectionRange(0, 0);

	}

	keyDownHandle(e) {

		// console.log(e.keyCode);

		if (this.props.isFocused != true) {
			return;
		}

		switch (e.keyCode) {
			case 8:
				this.props.onTextChanged('', true);
				break;
		}

	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.editorData !== this.props.editorData
			|| nextProps.isFocused !== this.props.isFocused
			|| nextProps.cursorPos.line !== this.props.cursorPos.line
			|| nextProps.cursorPos.col !== this.props.cursorPos.col;
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isFocused == true) {
			this.refs.textInput.focus();
			this.refs.textInput.setSelectionRange(0, 0);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isFocused == true) {
			this.refs.textInput.focus();
			this.refs.textInput.setSelectionRange(0, 0);
		}
	}

	componentDidMount() {
		if (this.props.isFocused == true) {
			this.refs.textInput.focus();
			this.refs.textInput.setSelectionRange(0, 0);
		}
	}

	render() {

		// console.log('EditorScrollerTextInput render');

		const {} = this.props;
		const {inputHandle, keyDownHandle} = this;

		return (
			<textarea ref="textInput"
			          className="text-input"
			          onInput={inputHandle}
			          onKeyDown={keyDownHandle}></textarea>
		);

	}
};

EditorScrollerTextInput.propTypes = {

	editorData: PropTypes.string,
	isFocused: PropTypes.bool,
	cursorPos: PropTypes.object,
	onTextChanged: PropTypes.func

};