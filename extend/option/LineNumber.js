var LineNumber = {

	createNumber(len, target) {
		let result = [];
		for (let i = 0; i < len; i++) {
			result.push('<div class="number">' + (i + 1) + '</div>');
		}
		target.html(result.join(''));
	}

};