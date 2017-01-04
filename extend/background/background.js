chrome.browserAction.onClicked.addListener(function () {

	chrome.tabs.query({
		currentWindow: true
	}, function (tabs) {

		var optionUrl = chrome.extension.getURL('option/index.html');
		var optionTab = tabs.filter(function (tab) {
			return tab.url.indexOf(optionUrl) != -1;
		});

		if (optionTab.length > 0) {
			chrome.tabs.update(optionTab[0].id, {
				selected: true
			});
		} else {
			chrome.tabs.create({
				url: optionUrl,
				selected: true
			})
		}

	});

});