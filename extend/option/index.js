$(() => {

	const textareaSource = $('#source');
	const textareaResult = $('#result');
	const formatInfo = $('#formatInfo');

	$('#format').click(() => {

		let source = textareaSource.val().split('\n'), formatCount, uniqueCount;

		let formatResult = FormatHandle.formatAll(source);
		formatCount = formatResult.info.count;

		let uniqueResut = FormatHandle.unique(FormatHandle.sort(formatResult.result));
		uniqueCount = uniqueResut.info.count;

		textareaResult.val(uniqueResut.result.join('\n'));
		LineNumber.createNumber(uniqueResut.result.length, $('#resultLineNumbers .lineNumbers'));

		formatInfo.html('format<span>' + formatCount + '</span><br/>distinct<span>' + uniqueCount + '</span>');

	});

	$('#source').keydown(e => {
		const self = this;
		if (e.ctrlKey == true && e.keyCode == 86) {
			let numberInterval = setInterval(function () {
				let value = $(self).val();
				if (value) {
					clearInterval(numberInterval);
					LineNumber.createNumber(value.split('\n').length, $('#sourceLineNumbers .lineNumbers'));
				}
			}, 0);
		}
	});

	let sourceValue = '';
	setInterval(() => {
		let value = $('#source').val();
		if (value != sourceValue) {
			sourceValue = value;
			LineNumber.createNumber(value.split('\n').length, $('#sourceLineNumbers .lineNumbers'));
		}
	}, 0);

	$('#source').scroll(e => {
		$('#sourceLineNumbers .lineNumbers').css('top', -e.target.scrollTop);
	});

	$('#result').keydown(e => {
		const self = this;
		if (e.ctrlKey == true && e.keyCode == 86) {
			let numberInterval = setInterval(function () {
				let value = $(self).val();
				if (value) {
					clearInterval(numberInterval);
					LineNumber.createNumber(value.split('\n').length, $('#resultLineNumbers .lineNumbers'));
				}
			}, 0);
		}
	});

	let resultValue = '';
	setInterval(() => {
		let value = $('#result').val();
		if (value != resultValue) {
			resultValue = value;
			LineNumber.createNumber(value.split('\n').length, $('#resultLineNumbers .lineNumbers'));
		}
	}, 0);

	$('#result').scroll(e => {
		$('#resultLineNumbers .lineNumbers').css('top', -e.target.scrollTop);
	});

});