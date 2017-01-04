import React, {Component, PropTypes} from 'react';

import EditorScrollerTextLine from './EditorScrollerTextLine';

export default class EditorScrollerTextLayer extends Component {

	constructor(props) {
		super(props);
	}

	filter(data, filterText) {

		if (!data) {
			return [];
		}

		let arrayData = data.split('\n'),
			array = [];

		if (arrayData && arrayData.length > 0) {
			array = filterText == '' ? arrayData : array.filter((value)=> value.indexOf(filterText) >= 0);
		}

		return array;

	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.editorData !== this.props.editorData
			|| nextProps.filterText !== this.props.filterText
			|| nextProps.editorConfig.lineHeight !== this.props.editorConfig.lineHeight
			|| nextProps.displayIndex.start !== this.props.displayIndex.start
			|| nextProps.displayIndex.end !== this.props.displayIndex.end
			|| nextProps.scroll.top !== this.props.scroll.top
			|| nextProps.contentSize.width !== this.props.contentSize.width;
	}

	render() {

		// console.log('EditorScrollerTextLayer render');

		const {editorData, filterText, editorConfig, editorSize, displayIndex, scroll, contentSize} = this.props;

		const dataArray = this.filter(editorData, filterText);

		return (
			<div className="layer text-layer"
			     style={{
				     width: contentSize.width || '100%',
				     height: editorSize.height,
				     // paddingLeft: editorConfig.horizonPadding,
				     paddingRight: editorConfig.horizonPadding + editorConfig.scrollbarWidth,
				     paddingBottom: editorConfig.scrollbarWidth
			     }}>
				{
					dataArray.map((value, index)=> {
						if (index >= displayIndex.start && index <= displayIndex.end) {
							return (
								<EditorScrollerTextLine key={index}
								                        editorConfig={editorConfig}
								                        top={editorConfig.lineHeight * index - (scroll.top || 0)}
								                        textData={value}
								                        lineIndex={index}/>
							);
						}
					})
				}
			</div>
		);

	}
};

EditorScrollerTextLayer.propTypes = {

	// EditorScroller
	editorData: PropTypes.string,
	scroll: PropTypes.object,
	filterText: PropTypes.string,
	editorConfig: PropTypes.object,
	editorSize: PropTypes.object,
	displayIndex: PropTypes.object,
	contentSize: PropTypes.object

};