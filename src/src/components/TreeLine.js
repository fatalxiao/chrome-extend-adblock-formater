import React, {Component, PropTypes} from 'react';

import Util from '../vendor/Util';
import CharSize from '../vendor/CharSize';

import '../assets/stylesheets/TreeLine.css';

export default class TreeLine extends Component {

	constructor(props) {

		super(props);

		this.inputPos = {
			start: 0,
			end: 0
		};

		this.state = {
			orginValue: this.props.nodeData.value,
			value: this.props.nodeData.value,
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
			max = max < this.props.nodeData.value.length ? max : this.props.nodeData.value.length;
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
		const {nodeData, modifyLine} = this.props;
		const {value, orginValue} = this.state;
		this.setState({
			editing: false
		}, ()=> {
			this.inputPos.start = 0;
			this.inputPos.end = 0;
		});
		value && value !== orginValue && !isNaN(nodeData.index) && modifyLine(nodeData.index, nodeData.parent + value);
	}

	del() {
		const {index} = this.props.nodeData;
		!isNaN(index) && this.props.deleteLine(index);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.nodeData.value,
			orginValue: nextProps.nodeData.value
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.orginValue !== nextState.orginValue
			|| this.state.value !== nextState.value
			|| this.state.editing !== nextState.editing
			|| this.state.mouseOver !== nextState.mouseOver
			|| this.props.nodeData !== nextProps.nodeData
			|| this.props.lineIndex !== nextProps.lineIndex;
	}

	componentDidUpdate() {
		this.selectInput();
	}

	render() {

		const {nodeData, lineIndex} = this.props;

		let {value, editing, mouseOver} = this.state;

		const {
			contentMouseEnter, contentMouseLeave,
			textMouseDown, textMouseUp, edit,
			editValue, save, inputMouseDown, inputMouseUp,
			del
		} = this;

		return (
			<div className="TreeLine"
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
						{nodeData.value || nodeData}
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

TreeLine.propTypes = {

	// TextArea
	nodeData: PropTypes.object,
	lineIndex: PropTypes.number,
	modifyLine: PropTypes.func,
	deleteLine: PropTypes.func

};