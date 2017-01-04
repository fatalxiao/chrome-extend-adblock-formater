import React, {Component, PropTypes} from 'react';

import EditorScrollerSelectLine from './EditorScrollerSelectLine';

export default class EditorScrollerMarkerLayer extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.editorConfig.lineHeight !== this.props.editorConfig.lineHeight
			|| nextProps.editorSize.width !== this.props.editorSize.width
			|| nextProps.editorSize.height !== this.props.editorSize.height
			|| (nextProps.selectionStartPosition && this.props.selectionStartPosition && (
				nextProps.selectionStartPosition.line !== this.props.selectionStartPosition.line
				|| nextProps.selectionStartPosition.col !== this.props.selectionStartPosition.col
				|| nextProps.selectionStartPosition.top !== this.props.selectionStartPosition.top
				|| nextProps.selectionStartPosition.left !== this.props.selectionStartPosition.left
			))
			|| (nextProps.selectionStopPosition && this.props.selectionStopPosition && (
				nextProps.selectionStopPosition.line !== this.props.selectionStopPosition.line
				|| nextProps.selectionStopPosition.col !== this.props.selectionStopPosition.col
				|| nextProps.selectionStopPosition.top !== this.props.selectionStopPosition.top
				|| nextProps.selectionStopPosition.left !== this.props.selectionStopPosition.left
			))
			|| nextProps.cursorPosition.top !== this.props.cursorPosition.top
			|| nextProps.displayIndex.start !== this.props.displayIndex.start
			|| nextProps.displayIndex.end !== this.props.displayIndex.end
			|| nextProps.contentSize.width !== this.props.contentSize.width;
	}

	render() {

		// console.log('EditorScrollerMarkerLayer render');

		const {editorConfig, editorSize, selectionStartPosition, selectionStopPosition, cursorPosition, displayIndex, contentSize} = this.props;

		const markerWidth = contentSize.width ? contentSize.width + 2 * editorConfig.horizonPadding + editorConfig.scrollbarWidth : '100%';

		const activeLineStyle = {
			width: markerWidth,
			height: editorConfig.lineHeight,
			top: cursorPosition.top,
			left: -editorConfig.horizonPadding
		};

		let array = [],
			direction;

		if (selectionStartPosition && selectionStopPosition) {

			let min = Math.min(selectionStartPosition.line, selectionStopPosition.line),
				max = Math.max(selectionStartPosition.line, selectionStopPosition.line)

			if (selectionStartPosition.line < selectionStopPosition.line) {
				direction = 1;
			} else if (selectionStartPosition.line > selectionStopPosition.line) {
				direction = -1;
			} else if (selectionStartPosition.col != selectionStopPosition.col) {
				direction = 0;
			}

			for (let i = min; i <= max; i++) {
				array.push(i);
			}

		}

		return (
			<div className="layer marker-layer"
			     style={{
				     width: markerWidth,
				     height: editorSize.height
			     }}>

				<div className="active-line"
				     style={activeLineStyle}></div>

				{
					selectionStartPosition && selectionStopPosition && !isNaN(direction) ?
						(direction == 0 ?
							(
								selectionStartPosition.line >= displayIndex.start && selectionStopPosition.line <= displayIndex.end ?
									<EditorScrollerSelectLine editorConfig={editorConfig}
									                          top={selectionStartPosition.top}
									                          left={Math.min(selectionStartPosition.left, selectionStopPosition.left)}
									                          width={Math.abs(selectionStartPosition.left - selectionStopPosition.left)}/>
									:
									null
							)
							:
							array.map((value, index)=> {
								if (value >= displayIndex.start && value <= displayIndex.end) {
									if (index == 0) {
										const left = direction > 0 ? selectionStartPosition.left : selectionStopPosition.left;
										return (
											<EditorScrollerSelectLine key={index}
											                          editorConfig={editorConfig}
											                          top={Math.min(selectionStartPosition.top, selectionStopPosition.top)}
											                          width={markerWidth - left}
											                          left={left}/>
										);
									} else if (index == array.length - 1) {
										const width = direction > 0 ? selectionStopPosition.left : selectionStartPosition.left;
										return (
											<EditorScrollerSelectLine key={index}
											                          editorConfig={editorConfig}
											                          top={Math.max(selectionStartPosition.top, selectionStopPosition.top)}
											                          left={0}
											                          width={width}/>
										);
									} else {
										return (
											<EditorScrollerSelectLine key={index}
											                          editorConfig={editorConfig}
											                          top={Math.min(selectionStartPosition.top, selectionStopPosition.top)
											                          + index * editorConfig.lineHeight}
											                          left={0}/>
										);
									}
								}
							}))
						:
						null
				}

			</div>
		);

	}
};

EditorScrollerMarkerLayer.propTypes = {

	// EditorScroller
	editorConfig: PropTypes.object,
	editorSize: PropTypes.object,
	selectionStartPosition: PropTypes.object,
	selectionStopPosition: PropTypes.object,
	cursorPosition: PropTypes.object,
	displayIndex: PropTypes.object,
	contentSize: PropTypes.object

};