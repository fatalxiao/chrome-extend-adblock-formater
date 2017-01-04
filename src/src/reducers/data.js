import undoable/*, {distinctState}*/ from 'redux-undo';
import FormatHandle from '../vendor/FormatHandle';
import * as ActionType from '../actions';

import testData from './testData';

const initialState = {
	source: testData,
	result: '',
	formatInfo: {
		formatCount: 0,
		distinctCount: 0
	}
};

function data(state = initialState, action) {
	switch (action.type) {

		case ActionType.APPEND_SOURCE_DATA:
		{
			let source = state.source.split('\n').slice();
			if (action.data instanceof Array) {
				source = source.concat(action.data);
			} else {
				source.push(action.data);
			}
			return {
				...state,
				source: source.join('\n')
			};
		}

		case ActionType.SET_SOURCE_DATA:
			return {
				...state,
				source: action.data
			};

		case ActionType.APPEND_RESULT_DATA:
		{
			let result = state.result.split('\n').slice();
			if (action.data instanceof Array) {
				result = result.concat(action.data);
			} else {
				result.push(action.data);
			}
			return {
				...state,
				result: result.join('\n')
			};
		}

		case ActionType.SET_RESULT_DATA:
			return {
				...state,
				result: action.data
			};

		case ActionType.SET_FORMAT_RESULT:
			return {
				...state,
				formatInfo: action.data
			};

		case ActionType.FORMAT_DATA:
		{
			let source = state.source.split('\n').slice();
			let formatResult = FormatHandle.formatAll(source);
			const formatCount = formatResult.info.count;
			let uniqueResult = FormatHandle.unique(FormatHandle.sort(formatResult.data));
			const distinctCount = uniqueResult.info.count;
			return {
				...state,
				result: uniqueResult.data.join('\n'),
				formatInfo: {
					formatCount,
					distinctCount
				}
			};
		}

		case ActionType.MODIFY_SOURCE:
		{
			let source = state.source.split('\n').slice();
			source[action.index] = action.value;
			return {
				...state,
				source: source.join('\n')
			};
		}

		case ActionType.DELETE_SOURCE_LINE:
		{
			let source = state.source.split('\n').slice();
			source.splice(action.index, 1);
			return {
				...state,
				source: source.join('\n')
			};
		}

		case ActionType.DELETE_SOURCE_NODE:
		{
			let source = state.source.split('\n').slice();
			source.splice(action.index, action.len);
			return {
				...state,
				source: source.join('\n')
			};
		}

		case ActionType.MODIFY_RESULT:
		{
			let result = state.result.split('\n').slice();
			result[action.index] = action.value;
			return {
				...state,
				result: result.join('\n')
			};
		}

		case ActionType.DELETE_RESULT_LINE:
		{
			let result = state.result.split('\n').slice();
			result.splice(action.index, 1);
			return {
				...state,
				result: result.join('\n')
			};
		}

		case ActionType.DELETE_RESULT_NODE:
		{
			let result = state.result.split('\n').slice();
			result.splice(action.index, action.len);
			return {
				...state,
				result: result.join('\n')
			};
		}

		case ActionType.COPY_RESULT:
		{
			let el = document.createElement('textarea');
			document.body.appendChild(el);
			el.value = state.result;
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
			return state;
		}

		default:
			return state;
	}
}

// export default data;

const undoable_data = undoable(data, {
	// filter: distinctState()
});

export default undoable_data;