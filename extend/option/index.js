var textareaSource = $('#source');
var textareaResult = $('#result');
var formatInfo = $('#formatInfo');

/**
 * 格式化
 */
$('#format').click(function () {

	var source = textareaSource.val().split('\n'), formatCount, uniqueCount;

	var formatResult = FormatHandle.formatAll(source);
	formatCount = formatResult.info.count;

	var uniqueResut = FormatHandle.unique(FormatHandle.sort(formatResult.result));
	uniqueCount = uniqueResut.info.count;

	textareaResult.val(uniqueResut.result.join('\n'));
	LineNumber.createNumber(uniqueResut.result.length, $('#resultLineNumbers .lineNumbers'));

	formatInfo.html('格式化<span>' + formatCount + '</span>条<br/>去重<span>' + uniqueCount + '</span>条');

});

$('#source').keydown(function (e) {
	var self = this;
	if (e.ctrlKey == true && e.keyCode == 86) {
		var numberInterval = setInterval(function () {
			var value = $(self).val();
			if (value) {
				clearInterval(numberInterval);
				LineNumber.createNumber(value.split('\n').length, $('#sourceLineNumbers .lineNumbers'));
			}
		}, 0);
	}
});

var sourceValue = '';
setInterval(function () {
	var value = $('#source').val();
	if (value != sourceValue) {
		sourceValue = value;
		LineNumber.createNumber(value.split('\n').length, $('#sourceLineNumbers .lineNumbers'));
	}
}, 0);

$('#source').scroll(function (e) {
	$('#sourceLineNumbers .lineNumbers').css('top', -e.target.scrollTop);
});


$('#result').keydown(function (e) {
	var self = this;
	if (e.ctrlKey == true && e.keyCode == 86) {
		var numberInterval = setInterval(function () {
			var value = $(self).val();
			if (value) {
				clearInterval(numberInterval);
				LineNumber.createNumber(value.split('\n').length, $('#resultLineNumbers .lineNumbers'));
			}
		}, 0);
	}
});

var resultValue = '';
setInterval(function () {
	var value = $('#result').val();
	if (value != resultValue) {
		resultValue = value;
		LineNumber.createNumber(value.split('\n').length, $('#resultLineNumbers .lineNumbers'));
	}
}, 0);

$('#result').scroll(function (e) {
	$('#resultLineNumbers .lineNumbers').css('top', -e.target.scrollTop);
});