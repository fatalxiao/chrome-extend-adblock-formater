var FormatHandle = {

	/**
	 * 域名后缀
	 */
	domain: ['asia', 'band', 'bid', 'biz', 'cc', 'click', 'club', 'cn', 'co', 'com', 'date', 'design', 'engineer', 'gift', 'gov.cn', 'help',
		'info', 'lawyer', 'link', 'live', 'loan', 'market', 'me', 'mobi', 'name', 'net', 'news', 'online', 'org', 'party', 'photo', 'pics', 'press',
		'pub', 'red', 'ren', 'rocks', 'science', 'site', 'so', 'social', 'software', 'space', 'studio', 'tech', 'top', 'trade', 'tv', 'video', 'wang',
		'website', 'wiki', 'win', 'xin', 'xyz'],

	/**
	 * 判断是否为域名后缀
	 * @param value
	 * @returns {boolean}
	 */
	isDomain: function (value) {

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
	 * 格式化，并返回是否有改变
	 * @param value
	 * @returns {{result: *, info: {hasFormat: boolean}}}
	 */
	format: function (value) {

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
			result: result,
			info: {
				hasFormat: hasFormat
			}
		};

	},

	/**
	 * 格式化全部，并返回改变数
	 * @param source
	 * @returns {{result: Array, info: {count: number}}}
	 */
	formatAll: function (source) {
		var self = this;
		var result = [], count = 0;
		for (var i = 0, len = source.length; i < len; i++) {
			if (source[i]) {
				var temp = self.format(source[i]);
				if (temp.info.hasFormat) {
					count++;
				}
				result.push(temp.result);
			}
		}
		return {
			result: result,
			info: {
				count: count
			}
		};
	},

	/**
	 * 排序
	 * @param array
	 * @returns {*|Array.<T>}
	 */
	sort: function (array) {
		return array.sort(function (a, b) {
			return a.localeCompare(b);
		});
	},

	/**
	 * 去重，并返回改变数
	 * @param array
	 * @returns {{result: Array, info: {count: number}}}
	 */
	unique: function (array) {
		var result = [];
		if (array) {
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
		}
		return {
			result: result,
			info: {
				count: array.length - result.length
			}
		};
	}
}