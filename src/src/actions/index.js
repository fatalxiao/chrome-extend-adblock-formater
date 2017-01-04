// export function delete_source_line(index) {
// 	return (dispatch, getState) => {
// 		return dispatch(set_source_data(source));
// 	}
// };

export const APPEND_SOURCE_DATA = 'APPEND_SOURCE_DATA';
export function append_source_data(data) {
	return {
		type: APPEND_SOURCE_DATA,
		data
	};
};

export const SET_SOURCE_DATA = 'SET_SOURCE_DATA';
export function set_source_data(data) {
	return {
		type: SET_SOURCE_DATA,
		data
	};
};

export const APPEND_RESULT_DATA = 'APPEND_RESULT_DATA';
export function append_result_data(data) {
	return {
		type: APPEND_RESULT_DATA,
		data
	};
};

export const SET_RESULT_DATA = 'SET_RESULT_DATA';
export function set_result_data(data) {
	return {
		type: SET_RESULT_DATA,
		data
	};
};

export const SET_FORMAT_RESULT = 'SET_FORMAT_RESULT';
export function set_format_result(data) {
	return {
		type: SET_FORMAT_RESULT,
		data
	};
};

export const FORMAT_DATA = 'FORMAT_DATA';
export function format_data() {
	return {
		type: FORMAT_DATA
	};
};

export const MODIFY_SOURCE = 'MODIFY_SOURCE';
export function modify_source(index, value) {
	return {
		type: MODIFY_SOURCE,
		index,
		value
	};
};

export const DELETE_SOURCE_LINE = 'DELETE_SOURCE_LINE';
export function delete_source_line(index) {
	return {
		type: DELETE_SOURCE_LINE,
		index
	};
};

export const DELETE_SOURCE_NODE = 'DELETE_SOURCE_NODE';
export function delete_source_node(index, len) {
	return {
		type: DELETE_SOURCE_NODE,
		index,
		len
	};
};

export const MODIFY_RESULT = 'MODIFY_RESULT';
export function modify_result(index, value) {
	return {
		type: MODIFY_RESULT,
		index,
		value
	};
};

export const DELETE_RESULT_LINE = 'DELETE_RESULT_LINE';
export function delete_result_line(index) {
	return {
		type: DELETE_RESULT_LINE,
		index
	};
};

export const DELETE_RESULT_NODE = 'DELETE_RESULT_NODE';
export function delete_result_node(index, len) {
	return {
		type: DELETE_RESULT_NODE,
		index,
		len
	};
};

export const COPY_RESULT = 'COPY_RESULT';
export function copy_result() {
	return {
		type: COPY_RESULT
	};
};