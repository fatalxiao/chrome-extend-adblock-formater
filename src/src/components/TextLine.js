import React, {Component, PropTypes} from 'react';

import Util from '../vendor/Util';
import CharSize from '../vendor/CharSize';

import '../assets/stylesheets/TextLine.css';

export default class TextLine extends Component {

	constructor(props) {

		super(props);

		this.inputPos = {
			start: 0,
			end: 0
		};

		this.state = {
			orginValue: this.props.textData,
			value: this.props.textData,
			editing: false,
			mouseOver: false
		};

		this.contentMouseEnter = this.contentMouseEnter.bind(this);
		this.contentMouseLeave = this.contentMouseLeave.bind(this);
		this.textMouseDown = this.textMouseDown.bind(this);
		this.textMouseUp = this.textMouseUp.bind(this);
		this.edit = this.edit.bind(this);
		this.editValue = this.editValue.bind(this);
		this.save = this.save.bind(this);
		this.inputMouseDown = this.inputMouseDown.bind(this);
		this.inputMouseUp = this.inputMouseUp.bind(this);
		this.del = this.del.bind(this);

	}

	selectInput() {
		const editInput = this.refs.editInput;
		if (editInput) {
			const min = Math.min(this.inputPos.start, this.inputPos.end);
			let max = Math.max(this.inputPos.start, this.inputPos.end);
			max = max < this.props.textData.length ? max : this.props.textData.length;
			editInput.focus();
			editInput.setSelectionRange(min, max);
		}
	}

	contentMouseEnter() {
		this.setState({
			mouseOver: true
		}, ()=> {
			this.selectInput();
		});
	}

	contentMouseLeave() {
		this.setState({
			mouseOver: false
		}, ()=> {
			this.selectInput();
		});
	}

	inputMouseDown(e) {
		const offset = e.pageX - Util.getOffset(e.target).left + e.target.scrollLeft;
		this.inputPos.start = this.inputPos.end = CharSize.getTextPosition(this.state.value, offset, 14);
		this.selectInput();
	}

	inputMouseUp(e) {
		const offset = e.pageX - Util.getOffset(e.target).left + e.target.scrollLeft;
		this.inputPos.end = CharSize.getTextPosition(this.state.value, offset, 14);
		this.selectInput();
	}

	textMouseDown(e) {
		const offset = e.pageX - Util.getOffset(e.target).left;
		this.inputPos.start = this.inputPos.end = CharSize.getTextPosition(this.state.value, offset, 14);
	}

	textMouseUp(e) {
		const offset = e.pageX - Util.getOffset(e.target).left;
		this.inputPos.end = CharSize.getTextPosition(this.state.value, offset, 14);
	}

	edit() {
		this.setState({
			editing: true,
			value: this.state.orginValue
		}, ()=> {
			this.selectInput();
		});
	}

	editValue(e) {
		// console.log(e.target.value);
		this.setState({
			value: e.target.value
		});
	}

	save() {
		const {lineIndex, modifyLine} = this.props;
		const {value, orginValue} = this.state;
		this.setState({
			editing: false
		}, ()=> {
			this.inputPos.start = 0;
			this.inputPos.end = 0;
		});
		value !== orginValue && !isNaN(lineIndex) && value && modifyLine(lineIndex, value);
	}

	del() {
		!isNaN(this.props.lineIndex) && this.props.deleteLine(this.props.lineIndex);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.textData,
			orginValue: nextProps.textData
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.orginValue !== nextState.orginValue
			|| this.state.value !== nextState.value
			|| this.state.editing !== nextState.editing
			|| this.state.mouseOver !== nextState.mouseOver
			|| this.props.textData !== nextProps.textData
			|| this.props.lineIndex !== nextProps.lineIndex;
	}

	componentDidUpdate() {
		this.selectInput();
	}

	render() {

		const {textData, lineIndex} = this.props;

		const {value, editing, mouseOver} = this.state;

		const {
			contentMouseEnter, contentMouseLeave,
			textMouseDown, textMouseUp, edit,
			editValue, save, inputMouseDown, inputMouseUp,
			del
		} = this;

		return (
			<div className="TextLine"
			     style={this.props.style}>

				<div className="number">
					{lineIndex + 1}
				</div>

				<div className="content"
				     onMouseEnter={contentMouseEnter}
				     onMouseLeave={contentMouseLeave}>

					<div className="text"
					     onMouseDown={textMouseDown}
					     onMouseUp={textMouseUp}
					     onClick={edit}>
						{textData}
					</div>

					{
						editing ?
							<input ref="editInput"
							       type="text"
							       value={value}
							       onChange={editValue}
							       onBlur={save}
							       onMouseDown={inputMouseDown}
							       onMouseUp={inputMouseUp}/>
							:
							null
					}

					{
						editing ?
							null
							:
							<div className={'funcWrap' + (mouseOver ? '' : ' hidden')}>
								<i className="fa fa-times btnDel"
								   aria-hidden="true"
								   onClick={del}></i>
							</div>
					}

				</div>

			</div>
		);

	}
};

TextLine.propTypes = {

	// TextArea
	textData: PropTypes.string,
	lineIndex: PropTypes.number,
	modifyLine: PropTypes.func,
	deleteLine: PropTypes.func

};