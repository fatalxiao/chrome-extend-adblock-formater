import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/SearchBar.css';

@pureRender
export default class SearchBar extends Component {

	constructor(props) {

		super(props);

		this.state = {
			active: false
		};

		this.toggleActive = this.toggleActive.bind(this);

	}

	toggleActive() {
		this.setState({
			active: !this.state.active
		});
	}

	render() {

		const {filter} = this.props;
		const {active} = this.state;
		const {toggleActive} = this;

		return (
			<div className={'SearchBar' + (active ? ' active' : '')}>
				<input type="text"
				       onFocus={toggleActive}
				       onBlur={toggleActive}
				       onChange={filter}/>
				<i className="fa fa-search"
				   aria-hidden="true"></i>
			</div>
		);

	}
};

SearchBar.propTypes = {

	// Toolbar
	filter: PropTypes.func

};