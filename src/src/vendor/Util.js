if (!String.prototype.trim) {
	String.prototype.trim = ()=> this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

function getOffset(el) {
	let offset = {
		top: el.offsetTop,
		left: el.offsetLeft
	};
	while (el.offsetParent) {
		el = el.offsetParent;
		offset.top += el.offsetTop;
		offset.left += el.offsetLeft;
	}
	return offset;
};

export default {
	getOffset
};