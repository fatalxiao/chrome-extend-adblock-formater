import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import ResetButton from './ResetButton';
import UndoButton from './UndoButton';
import FormatButton from './FormatButton';
import RedoButton from './RedoButton';
import CopyButton from './CopyButton';

import '../assets/stylesheets/Action.css';

@pureRender
export default class Action extends Component {

	constructor(props) {
		super(props);
	}

	undo() {
		this.props.undo();
	}

	redo() {
		this.props.redo();
	}


	render() {

		const {app_data, format_data, undo, redo, jumpToPast, clearHistory, copy_result} = this.props;

		const formatCount = app_data.present.formatInfo.formatCount,
			distinctCount = app_data.present.formatInfo.distinctCount,
			reset = ()=> {
				jumpToPast(0);
				clearHistory();
			};

		return (
			<div className="Action">

				<div className="actions">
					<ResetButton disabled={app_data.past.length <= 0}
					             reset={reset}/>
					<UndoButton disabled={app_data.past.length <= 0}
					            undo={undo}/>
					<FormatButton disabled={app_data.present.source.length <= 0}
					              formatData={format_data}/>
					<RedoButton disabled={app_data.future.length <= 0}
					            redo={redo}/>
				</div>

				<div className="result">

					<CopyButton hidden={app_data.present.result.length <= 0}
					            copy_result={copy_result}/>

					<div className={'formatInfo' + (formatCount <= 0 && distinctCount <= 0 ? ' hidden' : '')}>
						<div className={'formatCount' + (formatCount <= 0 ? ' hidden' : '')}>
							format:
							<span className="count">{formatCount}</span>
						</div>
						<div className={'distinctCount' + (distinctCount <= 0 ? ' hidden' : '')}>
							distinct:
							<span className="count">{distinctCount}</span>
						</div>
					</div>

				</div>

			</div>
		);

	}
};

Action.propTypes = {

	// redux state
	app_data: PropTypes.object,

	// redux action
	format_data: PropTypes.func,
	copy_result: PropTypes.func,

	// redux undo
	undo: PropTypes.func,
	redo: PropTypes.func,
	jumpToPast: PropTypes.func,
	clearHistory: PropTypes.func

};