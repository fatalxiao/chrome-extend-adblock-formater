var LineNumber = {

	createNumber: function (len, target) {
		var result = [];
		for (var i = 0; i < len; i++) {
			result.push('<div class="number">' + (i + 1) + '</div>');
		}
		target.html(result.join(''));
	}

};