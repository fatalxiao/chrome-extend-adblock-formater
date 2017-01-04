const FormatHandle = {

	/**
	 * domain suffix
	 */
	domain: ['asia', 'band', 'bid', 'biz', 'cc', 'click', 'club', 'cn', 'co', 'com', 'date', 'design', 'engineer', 'gift', 'gov.cn', 'help',
		'info', 'lawyer', 'link', 'live', 'loan', 'market', 'me', 'mobi', 'name', 'net', 'news', 'online', 'org', 'party', 'photo', 'pics', 'press',
		'pub', 'red', 'ren', 'rocks', 'science', 'site', 'so', 'social', 'software', 'space', 'studio', 'tech', 'top', 'trade', 'tv', 'video', 'wang',
		'website', 'wiki', 'win', 'xin', 'xyz'],

	/**
	 * return whether the value is a domain
	 * @param value
	 * @returns {boolean}
	 */
	isDomain(value) {

		var self = this;
		var result = false;

		for (var i = 0, len = self.domain.length; i < len; i++) {
			if (value == self.domain[i]) {
				result = true;
				break;
			}
		}

		return result;

	},

	/**
	 * format one condition
	 * @param value
	 * @returns {{result: *, info: {hasFormat: boolean}}}
	 */
	format(value) {

		var self = this;
		var result = value, hasFormat = false;

		if (value.indexOf('##') != -1) {
			var href = value.substring(0, value.indexOf('##')).split('.');
			if (href.length > 2) {
				var index = href.length - 1;
				for (; index >= 0; index--) {
					if (!self.isDomain(href[index])) {
						break;
					}
				}
				if (index > 0) {
					href = href.slice(index, href.length).join('.');
					result = href + value.substring(value.indexOf('##'), value.length);
					hasFormat = true;
				}
			}
		}

		return {
			data: result,
			info: {
				hasFormat: hasFormat
			}
		};

	},

	/**
	 * format the array
	 * @param source
	 * @returns {{result: Array, info: {count: number}}}
	 */
	formatAll(source) {
		var self = this;
		var result = [], count = 0;
		for (var i = 0, len = source.length; i < len; i++) {
			if (source[i] && source[i].trim()) {
				var temp = self.format(source[i]);
				if (temp.info.hasFormat) {
					count++;
				}
				result.push(temp.data);
			}
		}
		return {
			data: result,
			info: {
				count: count
			}
		};
	},

	/**
	 * sort the array
	 * @param array
	 * @returns {*|Array.<T>}
	 */
	sort(array) {
		if (!array) {
			return;
		}
		return array.sort(function (a, b) {
			return a.localeCompare(b);
		});
	},

	/**
	 * distinct the array and return distinct count
	 * @param array
	 * @returns {{result: Array, info: {count: number}}}
	 */
	unique(array) {
		var result = [];
		if (!array) {
			return {
				result: [],
				info: {
					count: 0
				}
			};
		}
		if (array.length > 1) {
			result.push(array[0]);
			for (var i = 1, len = array.length; i < len; i++) {
				if (array[i] != result[result.length - 1]) {
					result.push(array[i]);
				}
			}
		} else {
			result = array;
		}
		return {
			data: result,
			info: {
				count: array.length - result.length
			}
		};
	},

	/**
	 * split a condition to key and value
	 * @param item
	 * @returns {*}
	 */
	splitItem(item) {
		if (item.substring(0, 3) == '@@|') {
			return {
				key: '@@|',
				value: item.substring(3)
			};
		} else if (item.indexOf('##') != -1) {
			return {
				key: item.substring(0, item.indexOf('##')),
				value: item.substring(item.indexOf('##') + 2)
			};
		}
		return {
			key: '',
			value: ''
		}
	}
};

export default FormatHandle;