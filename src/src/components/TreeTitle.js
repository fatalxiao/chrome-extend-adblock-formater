import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/TreeTitle.css';

@pureRender
export default class TreeTitle extends Component {

	constructor(props) {

		super(props);

		this.state = {
			mouseOver: false
		};

		this.nodeCtrlClickHandle = this.nodeCtrlClickHandle.bind(this);
		this.mouseEnterHandle = this.mouseEnterHandle.bind(this);
		this.mouseLeaveHandle = this.mouseLeaveHandle.bind(this);
		this.del = this.del.bind(this);

	}

	mouseEnterHandle() {
		this.setState({
			mouseOver: true
		});
	}

	mouseLeaveHandle() {
		this.setState({
			mouseOver: false
		});
	}

	del() {
		const {nodeData, deleteNode} = this.props;
		!isNaN(nodeData.index) && nodeData.children && deleteNode(nodeData.index, nodeData.children.length);
	}

	nodeCtrlClickHandle() {
		const {nodeData} = this.props;
		if (nodeData.collapsed) {
			this.props.expand(nodeData.value);
		} else {
			this.props.collapse(nodeData.value);
		}
	}

	render() {

		const {nodeData} = this.props;

		const {mouseOver} = this.state;

		const {nodeCtrlClickHandle, mouseEnterHandle, mouseLeaveHandle, del} = this;

		return (
			<div className="TreeTitle"
			     style={this.props.style}>

				<div className="nodeCtrl"
				     onClick={nodeCtrlClickHandle}>
					{
						nodeData.collapsed ? '+' : '-'
					}
				</div>

				<div className="content"
				     onMouseEnter={mouseEnterHandle}
				     onMouseLeave={mouseLeaveHandle}>

					<div className="text"
					     onClick={nodeCtrlClickHandle}>
						{nodeData.value}
						<span className="len">
							({nodeData.children.length})
						</span>
					</div>

					<div className={'funcWrap' + (mouseOver ? '' : ' hidden')}>
						<i className="fa fa-times btnDel"
						   aria-hidden="true"
						   onClick={del}></i>
					</div>

				</div>

			</div>
		);

	}
};

TreeTitle.propTypes = {

	// TextArea
	nodeData: PropTypes.object,
	deleteLine: PropTypes.func,
	deleteNode: PropTypes.func,
	collapse: PropTypes.func,
	expand: PropTypes.func

};