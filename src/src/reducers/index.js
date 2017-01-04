import {combineReducers} from 'redux';;
import {routerReducer as routing} from 'react-router-redux';

import data from './data';

const rootReducer = combineReducers({
	data,
	routing
});

export default rootReducer;