import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import Toolbar from '../components/Toolbar';
import TextArea from '../components/TextArea';
import TreeArea from '../components/TreeArea';

import '../assets/stylesheets/Frame.css';

@pureRender
export default class SourceFrame extends Component {

	constructor(props) {

		super(props);

		this.state = {
			filterText: '',
			showType: 'list', // list | tree
			collapseType: 0 // -1: manual, 0: collapseAll, 1: expandAll
		};

		this.showList = this.showList.bind(this);
		this.showTree = this.showTree.bind(this);
		this.treeManual = this.treeManual.bind(this);
		this.treeCollapseAll = this.treeCollapseAll.bind(this);
		this.treeExpandAll = this.treeExpandAll.bind(this);
		this.filter = this.filter.bind(this);

	}

	showList() {
		this.setState({
			showType: 'list'
		});
	}

	showTree() {
		this.setState({
			showType: 'tree'
		});
	}

	treeManual() {
		this.setState({
			collapseType: -1
		});
	}

	treeCollapseAll() {
		this.setState({
			collapseType: 0
		});
	}

	treeExpandAll() {
		this.setState({
			collapseType: 1
		});
	}

	filter(e) {
		this.setState({
			filterText: e.target.value
		});
	}

	render() {

		const {
			dataType, app_data, windowHeight,
			modify_source, delete_source_line, delete_source_node,
			modify_result, delete_result_line, delete_result_node
		} = this.props;

		const {showType, filterText, collapseType} = this.state;

		const {showList, showTree, treeManual, treeCollapseAll, treeExpandAll, filter} = this;

		return (
			<div type={dataType}
			     className="Frame">

				<Toolbar type={dataType}
				         showType={showType}
				         showList={showList}
				         showTree={showTree}
				         filter={filter}
				         treeCollapseAll={treeCollapseAll}
				         treeExpandAll={treeExpandAll}/>

				{
					showType == 'list'
					&&
					(
						dataType == 'source' ?
							<TextArea arrayData={app_data.present.source}
							          filterText={filterText}
							          modifyLine={modify_source}
							          deleteLine={delete_source_line}
							          windowHeight={windowHeight}/>
							:
							<TextArea arrayData={app_data.present.result}
							          filterText={filterText}
							          modifyLine={modify_result}
							          deleteLine={delete_result_line}
							          windowHeight={windowHeight}/>
					)

				}

				{
					showType == 'tree'
					&&
					(
						dataType == 'source' ?
							<TreeArea treeData={app_data.present.source}
							          filterText={filterText}
							          modifyLine={modify_source}
							          deleteLine={delete_source_line}
							          deleteNode={delete_source_node}
							          windowHeight={windowHeight}
							          collapseType={collapseType}
							          treeManual={treeManual}/>
							:
							<TreeArea treeData={app_data.present.result}
							          filterText={filterText}
							          modifyLine={modify_result}
							          deleteLine={delete_result_line}
							          deleteNode={delete_result_node}
							          windowHeight={windowHeight}
							          collapseType={collapseType}
							          treeManual={treeManual}/>
					)
				}

			</div>
		);

	}
};

SourceFrame.propTypes = {

	// redux state
	app_data: PropTypes.object,

	// redux action
	modify_source: PropTypes.func,
	delete_source_line: PropTypes.func,
	delete_source_node: PropTypes.func,

	modify_result: PropTypes.func,
	delete_result_line: PropTypes.func,
	delete_result_node: PropTypes.func,

	// App
	dataType: PropTypes.string,
	windowHeight: PropTypes.number

};