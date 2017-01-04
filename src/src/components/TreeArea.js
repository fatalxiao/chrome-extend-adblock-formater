import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import TreeTitle from './TreeTitle';
import TreeLine from './TreeLine';
import FormatHandle from '../vendor/FormatHandle';

import '../assets/stylesheets/TreeArea.css';

@pureRender
export default class TreeArea extends Component {

	constructor(props) {

		super(props);

		this.nextStateAnimationFrameId = null;
		this.textLineHeight = 25;

		this.state = {
			textAreaHeight: 0,
			scrollTop: 0,
			expandIds: {}
		};

		this.scrollHandle = this.scrollHandle.bind(this);
		this.collapse = this.collapse.bind(this);
		this.expand = this.expand.bind(this);

	}

	/**
	 * set state when next animation frame
	 * @param state
	 */
	setNextState(state) {
		if (this.nextStateAnimationFrameId) {
			requestAnimationFrame.cancel(this.nextStateAnimationFrameId);
		}
		this.nextStateAnimationFrameId = requestAnimationFrame(()=> {
			this.nextStateAnimationFrameId = null;
			this.setState(state);
		});
	}

	/**
	 * set scrollTop state
	 * @param e
	 */
	scrollHandle(e) {
		// console.log('textarea scroll: ', e.target.scrollTop);
		this.setNextState({
			scrollTop: e.target.scrollTop
		});
	}

	/**
	 * filter the data by filterText
	 * @param arrayData
	 * @param filterText
	 * @returns {Array}
	 */
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

	/**
	 * set a node data
	 * @param result
	 * @param node
	 */
	handleItem(result, node) {
		node.value = result.key;
		node.children.push(result.value);
	}

	/**
	 * append a node to tree, and append children to tree if the node is expanded
	 * @param tree
	 * @param child
	 * @returns {*}
	 */
	treeAppend(tree, node) {
		tree.push(node);
		if (!node.collapsed && node.children && node.children.length > 0) {
			for (let i = 0, len = node.children.length; i < len; i++) {
				tree.push({
					value: node.children[i],
					parent: node.value,
					leaf: true,
					index: node.index + i
				});
			}
		}
	}

	/**
	 * generate a tree-like array from origin array data
	 * @param array
	 * @returns {Array}
	 */
	generateTree(array) {

		let tree = [],
			index = 0,
			node = {
				value: '',
				collapsed: true,
				children: [],
				leaf: false,
				index: index
			},
			temp = array.slice();

		while (temp.length > 0) {

			let item = temp[0];

			const result = FormatHandle.splitItem(item);
			if (result.key.trim()) {
				if (node.value == result.key) {
					this.handleItem(result, node);
				} else {
					if (node.value) {
						this.treeAppend(tree, node);
						node = {
							value: '',
							collapsed: true,
							children: [],
							leaf: false,
							index: index
						};
					}
					if (result.key in this.state.expandIds) {
						node.collapsed = false;
					}
					this.handleItem(result, node);
				}
			}

			temp.shift();
			index++;

		}

		if (node.value) {
			this.treeAppend(tree, node);
		}

		return tree;

	}

	/**
	 * collapse a node
	 * @param id
	 */
	collapse(id) {
		this.props.treeManual();
		let expandIds = Object.assign({}, this.state.expandIds);
		if (id in expandIds) {
			delete expandIds[id];
			this.setState({
				expandIds: expandIds
			});
		}
	}

	/**
	 * expand a node
	 * @param id
	 */
	expand(id) {
		this.props.treeManual();
		let expandIds = Object.assign({}, this.state.expandIds);
		if (!(id in expandIds)) {
			expandIds[id] = true;
			this.setState({
				expandIds: expandIds
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.collapseType == 0) {
			this.setState({
				expandIds: {}
			});
		} else if (nextProps.collapseType == 1) {

			const {treeData, filterText} = this.props;
			let o = {};

			const array = this.filterArray(treeData, filterText);
			const tree = this.generateTree(array);
			tree.forEach(function (node) {
				o[node.value] = true;
			});

			this.setState({
				expandIds: o
			});

		}
	}

	render() {

		const {treeData, filterText, windowHeight, modifyLine, deleteLine, deleteNode} = this.props;
		const {scrollTop} = this.state;
		const {textLineHeight, scrollHandle, collapse, expand} = this;

		// filter array
		const array = this.filterArray(treeData, filterText);

		// generate a tree array
		let tree = this.generateTree(array);

		// calculate height
		const textAreaHeight = windowHeight - 80;
		const contentStyle = {
			height: textLineHeight * tree.length
		};

		// calculate start and end index
		let startIndex, endIndex = tree.length - 1;
		startIndex = Math.floor(scrollTop / textLineHeight);
		const listLength = Math.floor(textAreaHeight / textLineHeight);
		if (tree.length > listLength) {
			endIndex = startIndex + listLength;
		}

		return (
			<div className="TreeArea">
				<div className="lineNumberBackground"></div>
				<div className="treeListWrap"
				     onScroll={scrollHandle}>
					<div className="treeList"
					     style={contentStyle}>
						{
							tree.map((node, index)=> {
								if (index >= startIndex && index <= endIndex) {
									return (
										node.leaf ?
											<TreeLine style={{top: textLineHeight * index}}
											          key={index}
											          nodeData={node}
											          lineIndex={node.index}
											          modifyLine={modifyLine}
											          deleteLine={deleteLine}/>
											:
											<TreeTitle style={{top: textLineHeight * index}}
											           key={index}
											           nodeData={node}
											           deleteLine={deleteLine}
											           deleteNode={deleteNode}
											           collapse={collapse}
											           expand={expand}/>
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

TreeArea.propTypes = {

	// Frame
	treeData: PropTypes.array,
	filterText: PropTypes.string,
	modifyLine: PropTypes.func,
	deleteLine: PropTypes.func,
	deleteNode: PropTypes.func,
	windowHeight: PropTypes.number,
	collapseType: PropTypes.number,
	treeManual: PropTypes.func

};