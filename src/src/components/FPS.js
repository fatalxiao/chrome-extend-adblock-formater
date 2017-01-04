import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/FPS.css';

@pureRender
export default class FPS extends Component {

	constructor(props) {

		super(props);

		this.fps;
		this.last;

		this.state = {
			fps: 0
		};

	}

	step() {

		const offset = Date.now() - this.last;
		this.fps += 1;

		if (offset >= 1000) {
			this.last += offset;
			this.setState({
				fps: this.fps
			});
			this.fps = 0;
		}

		requestAnimationFrame(this.step.bind(this));

	}

	componentDidMount() {

		// init
		this.fps = 0;
		this.last = Date.now();

		// start
		this.step();

	}

	render() {

		const {fps} = this.state;

		return (
			<div className="FPS">
				{fps}
			</div>
		);

	}
};

FPS.propTypes = {};