import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';

import '../assets/stylesheets/DropZone.css';

@pureRender
export default class DropZone extends Component {

	constructor(props) {

		super(props);

		this.state = {};

		this.dropFile = this.dropFile.bind(this);

	}

	dropFile(e) {
		// console.log(e);
		const self = this;
		e.preventDefault();

		let file = e.dataTransfer.files[0];
		if (file.type == 'text/plain') {
			let fileReader = new FileReader();
			fileReader.onloadend = function (e) {
				e.target.readyState == FileReader.DONE && e.target.result
				&& self.props.append_source_data(e.target.result.trim().split('\n'));
				self.props.hide();
			};
			fileReader.readAsText(file);
		}
	}

	render() {

		const {hidden, show, hide} = this.props;

		// <div className="wrap">
		// 	<i className="fa fa-skyatlas"
		// 	   aria-hidden="true"></i>
		// 	<div className="text">DRAG & DROP</div>
		// </div>

		return (
			<div className={'DropZone' + (hidden ? ' hidden' : '')}
			     onDragEnter={show}
			     onDragOver={show}
			     onDrop={this.dropFile}
			     onDragLeave={hide}>
				<div className="imageWrap">
					<div className="DropZoneImage top"></div>
					<div className="DropZoneImage left"></div>
					<div className="DropZoneImage center"></div>
					<div className="DropZoneImage right"></div>
					<div className="DropZoneImage bottom"></div>
				</div>
			</div>
		);

	}
};

DropZone.propTypes = {

	// redux actions
	append_source_data: PropTypes.func,

	// App
	hidden: PropTypes.bool,
	show: PropTypes.func,
	hide: PropTypes.func

};