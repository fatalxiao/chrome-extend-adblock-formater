chrome.browserAction.onClicked.addListener(() => {

	chrome.tabs.query({
		currentWindow: true
	}, tabs => {

		const optionUrl = chrome.extension.getURL('option/index.html');
		const optionTab = tabs.filter(tab => {
			return tab.url.includes(optionUrl);
		});

		if (optionTab.length > 0) { // 如果当前窗口中有已经打开的窗口，切换到此窗口
			chrome.tabs.update(optionTab[0].id, {
				selected: true
			});
		} else { // 不然打开新窗口
			chrome.tabs.create({
				url: optionUrl,
				selected: true
			});
		}

	});

});