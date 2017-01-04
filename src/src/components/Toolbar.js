import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import ListButton from './ListButton';
import TreeButton from './TreeButton';
import CollapseButton from './CollapseButton';
import ExpandButton from './ExpandButton';
import SearchBar from './SearchBar';

import '../assets/stylesheets/Toolbar.css';

@pureRender
export default class Toolbar extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {type, showType, showList, showTree, treeCollapseAll, treeExpandAll, filter} = this.props;

		return (
			<div className="Toolbar">

				<div className="title">{type}</div>

				<div className="showTypes">

					<ListButton active={showType == 'list'}
					            onClick={showList}/>

					<TreeButton active={showType == 'tree'}
					            onClick={showTree}/>

				</div>

				{
					showType == 'tree' ?
						<div className="treeCtrls">

							<CollapseButton onClick={treeCollapseAll}/>

							<ExpandButton onClick={treeExpandAll}/>

						</div>
						:
						null
				}

				<SearchBar filter={filter}/>

			</div>
		);

	}
};

Toolbar.propTypes = {

	// Frame
	type: PropTypes.string,
	showType: PropTypes.string,
	showList: PropTypes.func,
	showTree: PropTypes.func,
	treeCollapseAll: PropTypes.func,
	treeExpandAll: PropTypes.func,
	filter: PropTypes.func

};