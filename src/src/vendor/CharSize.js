const CharSize = {

	$el: null,

	$charSize: {},

	$charCount: null,

	$fontSize: 12,

	computerCharCount() {
		let el = document.createElement('div');
		this.setStyles(el.style);
		el.style.width = '0.2px';
		document.documentElement.appendChild(el);
		var width = el.getBoundingClientRect().width;
		if (width > 0 && width < 1) {
			this.$charCount = 50;
		} else {
			this.$charCount = 100;
		}
		el.parentNode.removeChild(el);
	},

	createEl() {
		this.$el = document.createElement('div');
		this.setStyles(this.$el.style);
		document.documentElement.appendChild(this.$el);
	},

	setStyles(style) {
		style.width = 'auto';
		style.left = '0px';
		style.visibility = 'hidden';
		style.position = 'absolute';
		style.whiteSpace = 'pre';
		// style.font = 'inherit';
		style.fontSize = this.$fontSize + 'px';
		style.overflow = 'visible';
	},

	stringRepeat(string, count) {
		var result = '';
		while (count > 0) {
			if (count & 1) {
				result += string;
			}
			if (count >>= 1) {
				string += string;
			}
		}
		return result;
	},

	getCharSize(char) {
		if (char in this.$charSize) {
			return this.$charSize[char];
		}
		if (!this.$el) {
			this.createEl();
		}
		if (!this.$charCount) {
			this.computerCharCount();
		}
		this.$el.innerHTML = this.stringRepeat(char, this.$charCount);
		return this.$charSize[char] = this.$el.getBoundingClientRect().width / this.$charCount;
	},

	getTextPosition(text, offset, fontSize) {
		this.$fontSize = fontSize;
		let curr, next;
		for (let char of text) {

			if (!curr && !next) {
				curr = {
					len: 0,
					index: 0
				};
				next = {
					len: this.getCharSize(char),
					index: 1
				};
			} else {
				curr = Object.assign({}, next);
				next.len += this.getCharSize(char);
				next.index++;
			}

			if (curr.len == offset) {
				return curr.index;
			} else if (next.len == offset) {
				return next.index;
			} else if (curr.len < offset && next.len > offset) {
				if (Math.abs(curr.len - offset) <= Math.abs(next.len - offset)) {
					return curr.index;
				} else {
					return next.index;
				}
			}

		}

		return text.length;
	}

};

export default CharSize;