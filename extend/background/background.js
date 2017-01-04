chrome.browserAction.onClicked.addListener(() => {

	chrome.tabs.query({
		currentWindow: true
	}, tabs => {

		const optionUrl = chrome.extension.getURL('option/index.html');
		const optionTab = tabs.filter(tab => {
			return tab.url.includes(optionUrl);
		});

		if (optionTab.length > 0) { // active tab if option page has been opened in this window
			chrome.tabs.update(optionTab[0].id, {
				selected: true
			});
		} else { // else open new tab of option page
			chrome.tabs.create({
				url: optionUrl,
				selected: true
			});
		}

	});

});